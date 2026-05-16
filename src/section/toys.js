import '../css/toys.css'   // ← CSS externalisé
import DATA from '../data/toys.json'

export default function initToys() {

  function loadScript(src, cb) {
    const s = document.createElement('script')
    s.src = src; s.onload = cb; document.head.appendChild(s)
  }

  function init() {
    if (typeof gsap === 'undefined') {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', () =>
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', () => {
          gsap.registerPlugin(ScrollTrigger); build()
        })
      )
    } else { gsap.registerPlugin(ScrollTrigger); build() }
  }

  function build() {
    const container = document.getElementById('lesJouets')
    if (!container) return console.warn('#lesJouets introuvable')

    // ── DOM ───────────────────────────────────────────────────────────────────
    const sticky = document.createElement('div')
    sticky.className = 'toys-sticky'
    container.appendChild(sticky)

    const canvas = document.createElement('div')
    canvas.className = 'toys-canvas'
    sticky.appendChild(canvas)

    canvas.addEventListener('mouseenter', () => canvas.classList.add('has-hover'))
    canvas.addEventListener('mouseleave', () => canvas.classList.remove('has-hover'))

    // Panneau texte bas-gauche
    const panel = document.createElement('div')
    panel.className = 'toys-panel'
    panel.innerHTML = `
      <div class="toys-eyebrow"  id="t-eyebrow">Scène 1 · Un jardin libre</div>
      <div class="toys-headline" id="t-headline">Et si les enfants choisissaient librement&nbsp;?</div>
      <div class="toys-body"     id="t-body">
        Dans ce jardin, chaque pousse représente un enfant de 2 ans.<br><br>
        Elles gravitent naturellement autour de trois centres d'intérêt :<br>
        <em>prendre soin</em>, <em>agir</em>, <em>construire</em>.<br><br>
        Rien ne distingue encore les filles des garçons.
      </div>
      <div class="toys-note" id="t-note">
        63% des filles <strong>et</strong> 52% des garçons jouent avec des peluches.<br>
        57% des filles jouent à la balle. Les intérêts se recoupent largement.
      </div>
    `
    sticky.appendChild(panel)

    // Source
    const src = document.createElement('div')
    src.className = 'toys-source'
    src.textContent = 'Ined – Données 2013–2014 – © Observatoire des inégalités'
    sticky.appendChild(src)

    // Scroll hint
    const hint = document.createElement('div')
    hint.className = 'toys-hint'; hint.id = 'toys-hint'
    hint.innerHTML = `<span>Défiler</span><div class="toys-hint-arrow"></div>`
    sticky.appendChild(hint)

    // ── PRNG ─────────────────────────────────────────────────────────────────
    function rng32(seed) {
      return () => {
        seed |= 0; seed = seed + 0x6d2b79f5 | 0
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
        return ((t ^ t >>> 14) >>> 0) / 4294967296
      }
    }

    // ── ZONES DE PLACEMENT ────────────────────────────────────────────────────
    const FREE_ZONES = {
      care: { xMin: 0.04, xMax: 0.42, yMin: 0.08, yMax: 0.50 },
      action: { xMin: 0.55, xMax: 0.95, yMin: 0.08, yMax: 0.55 },
      logic: { xMin: 0.38, xMax: 0.90, yMin: 0.48, yMax: 0.82 },
    }

    const TOY_ZONES = {
      poupee: { xMin: 0.30, xMax: 0.50, yMin: 0.12, yMax: 0.42 },
      peluches: { xMin: 0.10, xMax: 0.35, yMin: 0.08, yMax: 0.40 },
      dessins: { xMin: 0.38, xMax: 0.56, yMin: 0.38, yMax: 0.58 },
      balle: { xMin: 0.60, xMax: 0.82, yMin: 0.08, yMax: 0.38 },
      petites_voitures: { xMin: 0.78, xMax: 0.96, yMin: 0.12, yMax: 0.45 },
      puzzles: { xMin: 0.52, xMax: 0.74, yMin: 0.55, yMax: 0.80 },
      jeux_empiler: { xMin: 0.70, xMax: 0.90, yMin: 0.52, yMax: 0.78 },
      jeux_bain: { xMin: 0.44, xMax: 0.65, yMin: 0.60, yMax: 0.85 },
    }

    const STAT_POS = {
      poupee: { rx: 0.40, ry: 0.22 },
      petites_voitures: { rx: 0.87, ry: 0.22 },
    }

    // ── LABELS CLUSTER ───────────────────────────────────────────────────────
    const CLUSTERS = {
      care: { rx: 0.23, ry: 0.26, label: 'Soin' },
      action: { rx: 0.74, ry: 0.22, label: 'Action' },
      logic: { rx: 0.62, ry: 0.62, label: 'Construction & logique' },
    }

    const clusterLabelEls = {}
    Object.entries(CLUSTERS).forEach(([key, c]) => {
      const el = document.createElement('div')
      el.className = 'toys-cluster-label'
      el.textContent = c.label
      canvas.appendChild(el)
      clusterLabelEls[key] = el
    })

    function positionClusterLabels() {
      const cw = canvas.offsetWidth, ch = canvas.offsetHeight
      Object.entries(CLUSTERS).forEach(([key, c]) => {
        const el = clusterLabelEls[key]
        el.style.left = (c.rx * cw) + 'px'
        el.style.top = (c.ry * ch - 46) + 'px'
      })
    }

    // ── BADGES STATS ─────────────────────────────────────────────────────────
    const statBadges = {}
      ;[
        { id: 'poupee', stat: '81% filles · 19% garçons', label: 'Poupée' },
        { id: 'petites_voitures', stat: '89% garçons · 32% filles', label: 'Petites voitures' },
      ].forEach(({ id, stat, label }) => {
        const el = document.createElement('div')
        el.className = 'toys-stat-badge'
        el.style.opacity = '0'
        el.innerHTML = `<span class="toys-stat-number">${stat}</span><span class="toys-stat-sub">${label}</span>`
        canvas.appendChild(el)
        statBadges[id] = el
      })

    function positionStatBadges() {
      const cw = canvas.offsetWidth, ch = canvas.offsetHeight
      Object.entries(statBadges).forEach(([id, el]) => {
        const p = STAT_POS[id]
        el.style.left = (p.rx * cw) + 'px'
        el.style.top = (p.ry * ch) + 'px'
      })
    }

    // ── POSITIONS STABLES PAR POUSSE ─────────────────────────────────────────
    const posCache = {}

    function randomInZone(zone, r) {
      return {
        rx: zone.xMin + r() * (zone.xMax - zone.xMin),
        ry: zone.yMin + r() * (zone.yMax - zone.yMin),
      }
    }

    DATA.sprouts.forEach((sp, i) => {
      const r = rng32(i * 137 + 29)
      const freeZone = FREE_ZONES[sp.freeCluster] || FREE_ZONES.care
      const toyZone = TOY_ZONES[sp.freedToy] || FREE_ZONES.care
      posCache[sp.id] = {
        free: randomInZone(freeZone, r),
        toy: randomInZone(toyZone, r),
      }
    })

    // ── CRÉATION DES TIGES ───────────────────────────────────────────────────
    const TIGE_COUNT = 7
    const TIGE_HEIGHTS = [88, 78, 95, 72, 100, 82, 90]

    const sproutEls = DATA.sprouts.map((sp, i) => {
      const r = rng32(i * 53 + 7)
      const tigeN = (i % TIGE_COUNT) + 1
      const h = TIGE_HEIGHTS[tigeN - 1] * (0.88 + r() * 0.26)
      const rot = (r() - 0.5) * 14

      const wrap = document.createElement('div')
      wrap.className = 'sprout-el'
      wrap.style.position = 'absolute'
      wrap.style.transformOrigin = 'bottom center'

      const img = document.createElement('img')
      img.src = `/tige${tigeN}.svg`
      img.alt = ''
      img.style.height = Math.round(h) + 'px'
      img.style.transform = `rotate(${rot.toFixed(1)}deg)`
      wrap.appendChild(img)

      const toy = DATA.toys.find(t => t.id === sp.freedToy)
      const tip = document.createElement('div')
      tip.className = 'sprout-tooltip'
      tip.textContent = `${sp.gender === 'girl' ? 'Fille' : 'Garçon'} · ${toy?.label || sp.freedToy}`
      wrap.appendChild(tip)

      canvas.appendChild(wrap)
      return { el: wrap, sp, tigeN }
    })

    // ── PLACEMENT ─────────────────────────────────────────────────────────────
    function placeSprout(el, rx, ry) {
      const cw = canvas.offsetWidth, ch = canvas.offsetHeight
      const imgH = el.querySelector('img')?.offsetHeight || 80
      gsap.set(el, {
        x: rx * cw - (el.offsetWidth || 30) / 2,
        y: ry * ch - imgH,
      })
    }

    function initPositions() {
      positionClusterLabels()
      positionStatBadges()
      sproutEls.forEach(({ el, sp }) => {
        const pos = posCache[sp.id].free
        placeSprout(el, pos.rx, pos.ry)
        el.style.opacity = '1'
        el.style.filter = 'hue-rotate(0deg) saturate(1)'
      })
      Object.values(clusterLabelEls).forEach(el => { el.style.opacity = '1' })
      Object.values(statBadges).forEach(el => { el.style.opacity = '0' })
    }

    // ── SCÈNES ────────────────────────────────────────────────────────────────
    const SCENES = [
      {
        eyebrow: 'Scène 1 · Un jardin libre',
        headline: 'Et si les enfants choisissaient librement&nbsp;?',
        body: `Dans ce jardin, chaque pousse représente un enfant de 2 ans.<br><br>
                   Elles gravitent naturellement autour de trois centres d'intérêt :<br>
                   <em>prendre soin</em>, <em>agir</em>, <em>construire</em>.<br><br>
                   Rien ne distingue encore les filles des garçons.`,
        note: `63% des filles <strong>et</strong> 52% des garçons jouent avec des peluches.<br>
                   57% des filles jouent à la balle. Les intérêts se recoupent largement.`,
      },
      {
        eyebrow: 'Scène 2 · Le jouet leur est imposé',
        headline: 'Puis quelque chose change.',
        body: `Les pousses grandissent — et les jouets deviennent genrés.<br><br>
                   Celles qui quittent leur centre naturel se grisent.<br><br>
                   Elles ne disparaissent pas.<br>
                   <strong>Elles sont redirigées.</strong>`,
        note: `Ce n'est pas un changement naturel de goûts.<br>
                   C'est l'effet des attentes, des normes, des jouets qu'on leur propose.`,
      },
      {
        eyebrow: 'Scène 3 · L\'écart le plus fort',
        headline: 'Ce ne sont plus des préférences.<br>Ce sont des écarts.',
        body: `Les différences deviennent massives.<br><br>
                   Elles ne reflètent plus une curiosité naturelle.<br>
                   Elles traduisent <strong>une assignation</strong>.`,
        note: `Un enfant sur deux change de trajectoire.<br>
                   Pas parce qu'il en a envie.<br>
                   <em>Parce que son environnement l'y pousse.</em>`,
      },
    ]

    function setScene(idx) {
      const s = SCENES[idx]
      panel.classList.remove('visible')
      setTimeout(() => {
        document.getElementById('t-eyebrow').textContent = s.eyebrow
        document.getElementById('t-headline').innerHTML = s.headline
        document.getElementById('t-body').innerHTML = s.body
        document.getElementById('t-note').innerHTML = s.note
        panel.classList.add('visible')
      }, 160)
    }

    function isMismatched(sp) {
      const toy = DATA.toys.find(t => t.id === sp.freedToy)
      return toy && toy.cluster !== sp.freeCluster
    }

    // ── SCROLLTRIGGER 1 : Scène 0→1  (0% → 33%) ─────────────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '33% top',
      scrub: 2.5,
      onUpdate(self) {
        const p = self.progress
        if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 6))

        sproutEls.forEach(({ el, sp }) => {
          const fp = posCache[sp.id].free
          const tp = posCache[sp.id].toy
          const rx = fp.rx + (tp.rx - fp.rx) * p
          const ry = fp.ry + (tp.ry - fp.ry) * p
          placeSprout(el, rx, ry)

          if (isMismatched(sp)) {
            const sat = Math.max(0.1, 1 - p * 0.85)
            el.style.filter = `saturate(${sat})`
            el.style.opacity = String(1 - p * 0.45)
          } else {
            el.style.filter = 'saturate(1)'
            el.style.opacity = '1'
          }
        })

        Object.values(clusterLabelEls).forEach(el => {
          el.style.opacity = String(Math.max(0, 1 - p * 2.5))
        })
      },
      onEnter() { setScene(1) },
      onLeaveBack() { setScene(0); initPositions() },
    })

    // ── SCROLLTRIGGER 2 : Scène 1→2  (33% → 66%) ────────────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: '33% top',
      end: '66% top',
      scrub: 2.5,
      onUpdate(self) {
        const p = self.progress
        const HL = ['poupee', 'petites_voitures']

        const CROWD_POUPEE = { xMin: 0.25, xMax: 0.52, yMin: 0.28, yMax: 0.56 }
        const CROWD_VOITURES = { xMin: 0.72, xMax: 0.98, yMin: 0.28, yMax: 0.60 }
        const CROWD_OTHER = { xMin: 0.50, xMax: 0.70, yMin: 0.60, yMax: 0.80 }

        sproutEls.forEach(({ el, sp }, i) => {
          if (HL.includes(sp.freedToy)) {
            const pos = posCache[sp.id].toy
            placeSprout(el, pos.rx, pos.ry)
            el.style.opacity = '1'
            el.style.filter = 'saturate(1)'
          } else {
            let zone
            const toy = DATA.toys.find(t => t.id === sp.freedToy)
            if (toy?.cluster === 'care' || sp.freedToy === 'poupee' || sp.freedToy === 'peluches' || sp.freedToy === 'dessins') {
              zone = CROWD_POUPEE
            } else if (toy?.cluster === 'action') {
              zone = CROWD_VOITURES
            } else {
              zone = CROWD_OTHER
            }

            const fromPos = posCache[sp.id].toy
            const toPos = randomInZone(zone, rng32(i * 31 + 5))
            const rx = fromPos.rx + (toPos.rx - fromPos.rx) * p
            const ry = fromPos.ry + (toPos.ry - fromPos.ry) * p
            placeSprout(el, rx, ry)

            const sat = Math.max(0.05, 0.15 - p * 0.1)
            el.style.filter = `saturate(${sat})`
            el.style.opacity = String(Math.max(0.12, 0.55 - p * 0.43))
          }
        })

        Object.values(statBadges).forEach(el => {
          el.style.opacity = String(Math.min(1, p * 1.6))
        })
      },
      onEnter() { setScene(2) },
      onLeaveBack() {
        setScene(1)
        sproutEls.forEach(({ el, sp }) => {
          const pos = posCache[sp.id].toy
          placeSprout(el, pos.rx, pos.ry)
          if (isMismatched(sp)) {
            el.style.filter = 'saturate(0.15)'
            el.style.opacity = '0.55'
          } else {
            el.style.filter = 'saturate(1)'
            el.style.opacity = '1'
          }
        })
        Object.values(statBadges).forEach(el => { el.style.opacity = '0' })
      },
    })

    // ── RESIZE ────────────────────────────────────────────────────────────────
    let rt
    window.addEventListener('resize', () => {
      clearTimeout(rt)
      rt = setTimeout(() => {
        positionClusterLabels(); positionStatBadges()
        initPositions(); ScrollTrigger.refresh()
      }, 150)
    })

    // ── INIT ──────────────────────────────────────────────────────────────────
    requestAnimationFrame(() => requestAnimationFrame(() => {
      initPositions()
      setTimeout(() => panel.classList.add('visible'), 300)
    }))
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else { init() }
}

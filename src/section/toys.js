/**
 * src/section/toys.js — Scrollytelling "Jeux des enfants selon leur sexe"
 * Vite + ES module — importé depuis src/main.js
 * GSAP + ScrollTrigger injectés automatiquement depuis le CDN
 * Cible : <div id="lesJouets">
 */

export default function initToys() {

  // ─── 0. Injecter GSAP + ScrollTrigger ─────────────────────────────────────
  function loadScript(src, onload) {
    const s = document.createElement("script");
    s.src = src;
    s.onload = onload;
    document.head.appendChild(s);
  }

  function init() {
    if (typeof gsap === "undefined") {
      loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
        () => loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
          () => { gsap.registerPlugin(ScrollTrigger); build(); }
        )
      );
    } else {
      gsap.registerPlugin(ScrollTrigger);
      build();
    }
  }

  // ─── 1. Données ────────────────────────────────────────────────────────────
  const DATA = {
    toys: [
      { id: "poupee",           label: "Poupée",           cluster: "care",   girls: 81, boys: 19 },
      { id: "peluches",         label: "Peluches",         cluster: "care",   girls: 63, boys: 52 },
      { id: "dessins",          label: "Dessins",          cluster: "care",   girls: 73, boys: 58 },
      { id: "balle",            label: "Balle",            cluster: "action", girls: 57, boys: 76 },
      { id: "petites_voitures", label: "Petites voitures", cluster: "action", girls: 32, boys: 89 },
      { id: "puzzles",          label: "Puzzles",          cluster: "logic",  girls: 35, boys: 30 },
      { id: "jeux_empiler",     label: "Jeux à empiler",   cluster: "logic",  girls: 54, boys: 61 },
      { id: "jeux_bain",        label: "Jeux de bain",     cluster: "logic",  girls: 84, boys: 86 },
    ],
    sprouts: [
      { id:"s001", gender:"girl", freeCluster:"care",   freedToy:"poupee" },
      { id:"s002", gender:"girl", freeCluster:"care",   freedToy:"poupee" },
      { id:"s003", gender:"girl", freeCluster:"care",   freedToy:"poupee" },
      { id:"s004", gender:"girl", freeCluster:"care",   freedToy:"poupee" },
      { id:"s005", gender:"girl", freeCluster:"action", freedToy:"poupee" },
      { id:"s006", gender:"girl", freeCluster:"logic",  freedToy:"poupee" },
      { id:"s007", gender:"girl", freeCluster:"action", freedToy:"poupee" },
      { id:"s008", gender:"girl", freeCluster:"logic",  freedToy:"poupee" },
      { id:"s009", gender:"girl", freeCluster:"care",   freedToy:"poupee" },
      { id:"s010", gender:"girl", freeCluster:"care",   freedToy:"poupee" },
      { id:"s011", gender:"girl", freeCluster:"care",   freedToy:"peluches" },
      { id:"s012", gender:"girl", freeCluster:"care",   freedToy:"peluches" },
      { id:"s013", gender:"girl", freeCluster:"logic",  freedToy:"peluches" },
      { id:"s014", gender:"girl", freeCluster:"action", freedToy:"balle" },
      { id:"s015", gender:"girl", freeCluster:"action", freedToy:"balle" },
      { id:"s016", gender:"girl", freeCluster:"action", freedToy:"petites_voitures" },
      { id:"s017", gender:"girl", freeCluster:"logic",  freedToy:"puzzles" },
      { id:"s018", gender:"girl", freeCluster:"logic",  freedToy:"puzzles" },
      { id:"s019", gender:"girl", freeCluster:"logic",  freedToy:"jeux_empiler" },
      { id:"s020", gender:"girl", freeCluster:"care",   freedToy:"dessins" },
      { id:"s021", gender:"girl", freeCluster:"action", freedToy:"dessins" },
      { id:"s022", gender:"girl", freeCluster:"care",   freedToy:"jeux_bain" },
      { id:"s023", gender:"girl", freeCluster:"action", freedToy:"jeux_bain" },
      { id:"s024", gender:"girl", freeCluster:"logic",  freedToy:"jeux_bain" },
      { id:"s025", gender:"girl", freeCluster:"care",   freedToy:"poupee" },
      { id:"s026", gender:"boy",  freeCluster:"action", freedToy:"petites_voitures" },
      { id:"s027", gender:"boy",  freeCluster:"action", freedToy:"petites_voitures" },
      { id:"s028", gender:"boy",  freeCluster:"action", freedToy:"petites_voitures" },
      { id:"s029", gender:"boy",  freeCluster:"action", freedToy:"petites_voitures" },
      { id:"s030", gender:"boy",  freeCluster:"care",   freedToy:"petites_voitures" },
      { id:"s031", gender:"boy",  freeCluster:"logic",  freedToy:"petites_voitures" },
      { id:"s032", gender:"boy",  freeCluster:"care",   freedToy:"petites_voitures" },
      { id:"s033", gender:"boy",  freeCluster:"logic",  freedToy:"petites_voitures" },
      { id:"s034", gender:"boy",  freeCluster:"action", freedToy:"balle" },
      { id:"s035", gender:"boy",  freeCluster:"action", freedToy:"balle" },
      { id:"s036", gender:"boy",  freeCluster:"action", freedToy:"balle" },
      { id:"s037", gender:"boy",  freeCluster:"care",   freedToy:"balle" },
      { id:"s038", gender:"boy",  freeCluster:"logic",  freedToy:"balle" },
      { id:"s039", gender:"boy",  freeCluster:"care",   freedToy:"peluches" },
      { id:"s040", gender:"boy",  freeCluster:"logic",  freedToy:"peluches" },
      { id:"s041", gender:"boy",  freeCluster:"care",   freedToy:"poupee" },
      { id:"s042", gender:"boy",  freeCluster:"action", freedToy:"poupee" },
      { id:"s043", gender:"boy",  freeCluster:"logic",  freedToy:"puzzles" },
      { id:"s044", gender:"boy",  freeCluster:"logic",  freedToy:"puzzles" },
      { id:"s045", gender:"boy",  freeCluster:"action", freedToy:"jeux_empiler" },
      { id:"s046", gender:"boy",  freeCluster:"logic",  freedToy:"jeux_empiler" },
      { id:"s047", gender:"boy",  freeCluster:"care",   freedToy:"dessins" },
      { id:"s048", gender:"boy",  freeCluster:"action", freedToy:"dessins" },
      { id:"s049", gender:"boy",  freeCluster:"logic",  freedToy:"jeux_bain" },
      { id:"s050", gender:"boy",  freeCluster:"care",   freedToy:"jeux_bain" },
    ],
  };

  // ─── 2. Build ──────────────────────────────────────────────────────────────
  function build() {
    const container = document.getElementById("lesJouets");
    if (!container) return console.warn("toys.js : #lesJouets introuvable");

    // ── Styles ───────────────────────────────────────────────────────────────
    const style = document.createElement("style");
    style.textContent = `
      #lesJouets {
        position: relative;
        width: 100%;
        height: 500vh;
        background: #f7f4ee;
      }
      .toys-sticky-scene {
        position: sticky;
        top: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
      }
      .toys-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .toys-text-overlay {
        position: absolute;
        bottom: 2.5rem;
        left: 3rem;
        right: 3rem;
        pointer-events: none;
        z-index: 10;
      }
      .toys-scene-label {
        display: block;
        font-size: clamp(1rem, 2vw, 1.4rem);
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 0.4rem;
      }
      .toys-scene-desc {
        display: block;
        font-size: clamp(0.75rem, 1.1vw, 0.9rem);
        color: #555;
        max-width: 500px;
        line-height: 1.6;
      }
      .toys-source {
        display: block;
        font-size: 0.65rem;
        color: #bbb;
        margin-top: 0.6rem;
      }
      .toys-cluster-label {
        position: absolute;
        font-size: clamp(0.6rem, 0.9vw, 0.8rem);
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #999;
        pointer-events: none;
        transform: translateX(-50%);
        white-space: nowrap;
        transition: opacity 0.4s;
      }
      .toys-stat-badge {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        pointer-events: none;
        transform: translateX(-50%);
        transition: opacity 0.4s;
      }
      .toys-stat-number {
        font-size: clamp(0.85rem, 1.6vw, 1.3rem);
        font-weight: 700;
        color: #1a1a1a;
        white-space: nowrap;
      }
      .toys-stat-sub {
        font-size: 0.65rem;
        color: #888;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .sprout-el {
        position: absolute;
        will-change: transform, opacity;
        transform-origin: bottom center;
      }
    `;
    document.head.appendChild(style);

    // ── DOM ──────────────────────────────────────────────────────────────────
    const sticky = document.createElement("div");
    sticky.className = "toys-sticky-scene";
    container.appendChild(sticky);

    const canvas = document.createElement("div");
    canvas.className = "toys-canvas";
    sticky.appendChild(canvas);

    const textOverlay = document.createElement("div");
    textOverlay.className = "toys-text-overlay";
    textOverlay.innerHTML = `
      <span class="toys-scene-label" id="tsl">Un jardin libre</span>
      <span class="toys-scene-desc" id="tsd">50 enfants gravitent librement autour des centres d'intérêt qui les attirent. On ne sait pas qui est qui.</span>
      <span class="toys-source">Ined – Données 2013-2014 – © Observatoire des inégalités · Enfants âgés de deux ans.</span>
    `;
    sticky.appendChild(textOverlay);

    // ── Dimensions ───────────────────────────────────────────────────────────
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // ── Clusters ─────────────────────────────────────────────────────────────
    const CLUSTERS = {
      care:   { rx: 0.22, ry: 0.40, label: "Soin" },
      action: { rx: 0.78, ry: 0.40, label: "Action" },
      logic:  { rx: 0.50, ry: 0.72, label: "Construction & logique" },
    };

    // ── Positions jouets ─────────────────────────────────────────────────────
    const TOY_POS = {
      poupee:           { rx: 0.12, ry: 0.26 },
      peluches:         { rx: 0.22, ry: 0.50 },
      dessins:          { rx: 0.30, ry: 0.32 },
      balle:            { rx: 0.70, ry: 0.30 },
      petites_voitures: { rx: 0.86, ry: 0.26 },
      puzzles:          { rx: 0.42, ry: 0.68 },
      jeux_empiler:     { rx: 0.58, ry: 0.68 },
      jeux_bain:        { rx: 0.50, ry: 0.82 },
    };

    // ── Labels clusters ──────────────────────────────────────────────────────
    const clusterLabelEls = {};
    Object.entries(CLUSTERS).forEach(([key, c]) => {
      const el = document.createElement("div");
      el.className = "toys-cluster-label";
      el.textContent = c.label;
      canvas.appendChild(el);
      clusterLabelEls[key] = el;
    });

    function positionClusterLabels() {
      Object.entries(CLUSTERS).forEach(([key, c]) => {
        const el = clusterLabelEls[key];
        el.style.left = (c.rx * W()) + "px";
        el.style.top  = (c.ry * H() - 30) + "px";
      });
    }

    // ── Badges stats ─────────────────────────────────────────────────────────
    const statBadges = {};
    [
      { id: "poupee",           label: "Poupée",           stat: "81% filles · 19% garçons" },
      { id: "petites_voitures", label: "Petites voitures", stat: "89% garçons · 32% filles" },
    ].forEach(({ id, label, stat }) => {
      const el = document.createElement("div");
      el.className = "toys-stat-badge";
      el.style.opacity = "0";
      el.innerHTML = `<span class="toys-stat-number">${stat}</span><span class="toys-stat-sub">${label}</span>`;
      canvas.appendChild(el);
      statBadges[id] = el;
    });

    function positionStatBadges() {
      Object.entries(statBadges).forEach(([id, el]) => {
        const p = TOY_POS[id];
        el.style.left = (p.rx * W()) + "px";
        el.style.top  = (p.ry * H() - 70) + "px";
      });
    }

    // ── PRNG ─────────────────────────────────────────────────────────────────
    function mulberry32(seed) {
      return function () {
        seed |= 0; seed = seed + 0x6d2b79f5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }

    // ── SVG pousse ───────────────────────────────────────────────────────────
    function makeSproutSVG(seed) {
      const r = mulberry32(seed);
      const stemH   = 28 + r() * 18;
      const sway    = (r() - 0.5) * 10;
      const leafW   = 7  + r() * 6;
      const leafH   = 10 + r() * 8;
      const leafRot = -20 + r() * 40;
      const blobR   = 4  + r() * 4;
      const w = 40;
      const h = Math.ceil(stemH + blobR * 2 + 6);
      const cx = w / 2;
      return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M${cx} ${h} Q${cx+sway} ${h-stemH*0.5} ${cx+sway*0.3} ${h-stemH}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="${cx-leafW*0.7+sway*0.2}" cy="${h-stemH*0.55}" rx="${leafW*0.7}" ry="${leafH*0.4}" transform="rotate(${-30+leafRot} ${cx-leafW*0.7} ${h-stemH*0.55})" fill="currentColor" opacity="0.55"/>
        <ellipse cx="${cx+leafW*0.7+sway*0.2}" cy="${h-stemH*0.4}" rx="${leafW*0.6}" ry="${leafH*0.35}" transform="rotate(${20-leafRot*0.5} ${cx+leafW*0.7} ${h-stemH*0.4})" fill="currentColor" opacity="0.45"/>
        <ellipse cx="${cx+sway*0.3}" cy="${h-stemH-blobR}" rx="${blobR}" ry="${blobR*1.3}" fill="currentColor"/>
      </svg>`;
    }

    // ── Scatter stable ───────────────────────────────────────────────────────
    const rng = mulberry32(42);
    const scatterCache = {};
    function getScatter(id) {
      if (!scatterCache[id]) scatterCache[id] = { dx: (rng()-0.5)*0.14, dy: (rng()-0.5)*0.10 };
      return scatterCache[id];
    }
    function freePosOf(sp) {
      const c = CLUSTERS[sp.freeCluster];
      const s = getScatter(sp.id);
      return { rx: c.rx + s.dx, ry: c.ry + s.dy };
    }
    function toyPosOf(sp) {
      const base = TOY_POS[sp.freedToy] || { rx: 0.5, ry: 0.5 };
      const s = getScatter(sp.id);
      return { rx: base.rx + s.dx * 0.4, ry: base.ry + s.dy * 0.4 };
    }

    // ── Placer une pousse ────────────────────────────────────────────────────
    function placeSprout(el, rx, ry) {
      const w = el.offsetWidth  || 40;
      const h = el.offsetHeight || 55;
      gsap.set(el, { x: rx * W() - w/2, y: ry * H() - h });
    }

    function isMismatched(sp) {
      const toy = DATA.toys.find(t => t.id === sp.freedToy);
      return toy && toy.cluster !== sp.freeCluster;
    }

    // ── Créer pousses ────────────────────────────────────────────────────────
    const sproutEls = DATA.sprouts.map((sp, i) => {
      const el = document.createElement("div");
      el.className = "sprout-el";
      el.innerHTML = makeSproutSVG(i * 17 + 3);
      canvas.appendChild(el);
      return { el, sp };
    });

    // ── Texte ────────────────────────────────────────────────────────────────
    function updateText(label, desc) {
      document.getElementById("tsl").textContent = label;
      document.getElementById("tsd").textContent = desc;
    }

    // ── Init ─────────────────────────────────────────────────────────────────
    function initScene() {
      positionClusterLabels();
      positionStatBadges();
      sproutEls.forEach(({ el, sp }) => {
        const pos = freePosOf(sp);
        placeSprout(el, pos.rx, pos.ry);
        gsap.set(el, { color: "#4caf50", opacity: 1 });
      });
      Object.values(clusterLabelEls).forEach(el => { el.style.opacity = "1"; });
    }

    // ── Scène 1→2 : libre → genré ────────────────────────────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "30% top",
      scrub: 1.5,
      onUpdate(self) {
        const p = self.progress;
        sproutEls.forEach(({ el, sp }) => {
          const fp = freePosOf(sp);
          const tp = toyPosOf(sp);
          placeSprout(el, fp.rx + (tp.rx - fp.rx) * p, fp.ry + (tp.ry - fp.ry) * p);
          if (isMismatched(sp)) {
            const go = Math.round(76  + 84  * p);
            const gr = Math.round(175 - 15 * p);
            const gb = Math.round(80  + 80  * p);
            el.style.color = `rgb(${go},${gr},${gb})`;
            gsap.set(el, { opacity: 1 - p * 0.3 });
          }
        });
        Object.values(clusterLabelEls).forEach(el => { el.style.opacity = String(1 - p); });
      },
      onEnter() { updateText("Le jouet leur est imposé", "Dès 2 ans, les jouets sont genrés. Les enfants sont redirigés — certains quittent le cluster qui leur plaisait."); },
      onLeaveBack() {
        updateText("Un jardin libre", "50 enfants gravitent librement autour des centres d'intérêt qui les attirent. On ne sait pas qui est qui.");
        sproutEls.forEach(({ el }) => gsap.set(el, { color: "#4caf50", opacity: 1 }));
        Object.values(clusterLabelEls).forEach(el => { el.style.opacity = "1"; });
      },
    });

    // ── Scène 2→3 : focus écart ──────────────────────────────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: "30% top",
      end: "70% top",
      scrub: 1.5,
      onUpdate(self) {
        const p = self.progress;
        const HL = ["poupee", "petites_voitures"];
        sproutEls.forEach(({ el, sp }) => {
          if (!HL.includes(sp.freedToy)) gsap.set(el, { opacity: 1 - p * 0.9 });
          else gsap.set(el, { opacity: 1, scale: 1 + p * 0.12 });
        });
        Object.values(statBadges).forEach(el => { el.style.opacity = String(p); });
      },
      onEnter() { updateText("L'écart le plus fort", "Poupée : 81% filles, 19% garçons. Petites voitures : 89% garçons, 32% filles. Ce ne sont pas des goûts — ce sont des assignations."); },
      onLeaveBack() {
        updateText("Le jouet leur est imposé", "Dès 2 ans, les jouets sont genrés. Les enfants sont redirigés — certains quittent le cluster qui leur plaisait.");
        sproutEls.forEach(({ el }) => gsap.set(el, { opacity: 1, scale: 1 }));
        Object.values(statBadges).forEach(el => { el.style.opacity = "0"; });
      },
    });

    // ── Resize ───────────────────────────────────────────────────────────────
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        positionClusterLabels();
        positionStatBadges();
        initScene();
        ScrollTrigger.refresh();
      }, 150);
    });

    requestAnimationFrame(() => requestAnimationFrame(initScene));
  }

  // ── Démarrage ───────────────────────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
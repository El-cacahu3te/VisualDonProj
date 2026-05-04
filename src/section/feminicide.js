/**
 * src/section/feminicide.js — Scrollytelling "Féminicides en Suisse en 2025"
 * Vite + ES module — import initFeminicide from './section/feminicide.js'
 * Cible : <div id="féminicide">
 */

export default function initFeminicide() {

  function loadScript(src, cb) {
    const s = document.createElement("script");
    s.src = src; s.onload = cb; document.head.appendChild(s);
  }

  function init() {
    if (typeof gsap === "undefined") {
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js", () =>
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js", () => {
          gsap.registerPlugin(ScrollTrigger); build();
        })
      );
    } else { gsap.registerPlugin(ScrollTrigger); build(); }
  }

  // ── Données ────────────────────────────────────────────────────────────────
  const DATA = {
    source: "Observatoire des féminicides Suisse — 2025",
    totalVictims: 27,
    byMonth: [
      { month:1,  label:"Janvier",   count:4 },
      { month:2,  label:"Février",   count:4 },
      { month:3,  label:"Mars",      count:4 },
      { month:4,  label:"Avril",     count:3 },
      { month:5,  label:"Mai",       count:0 },
      { month:6,  label:"Juin",      count:4 },
      { month:7,  label:"Juillet",   count:1 },
      { month:8,  label:"Août",      count:5 },
      { month:9,  label:"Septembre", count:1 },
      { month:10, label:"Octobre",   count:0 },
      { month:11, label:"Novembre",  count:2 },
      { month:12, label:"Décembre",  count:0 },
    ],
    victims: [
      { id:"f01", month:1,  city:"Vouvry",                   canton:"Valais",          age:30,   ageKnown:true,  note:null },
      { id:"f02", month:1,  city:"Bienne",                   canton:"Berne",           age:31,   ageKnown:true,  note:null },
      { id:"f03", month:1,  city:"Berne",                    canton:"Berne",           age:44,   ageKnown:true,  note:null },
      { id:"f04", month:1,  city:"Lodrino",                  canton:"Tessin",          age:21,   ageKnown:true,  note:null },
      { id:"f05", month:2,  city:"Schönenwerd",              canton:"Soleure",         age:40,   ageKnown:true,  note:null },
      { id:"f06", month:2,  city:"Pratteln",                 canton:"Bâle-Campagne",   age:33,   ageKnown:true,  note:null },
      { id:"f07", month:2,  city:"Bülach",                   canton:"Zürich",          age:68,   ageKnown:true,  note:"Deux femmes tuées lors du même incident" },
      { id:"f08", month:2,  city:"Bülach",                   canton:"Zürich",          age:49,   ageKnown:true,  note:"Deux femmes tuées lors du même incident" },
      { id:"f09", month:3,  city:"Obermumpf",                canton:"Argovie",         age:55,   ageKnown:true,  note:null },
      { id:"f10", month:3,  city:"Emmenbrücke",              canton:"Lucerne",         age:40,   ageKnown:true,  note:"Mère et fille tuées lors du même incident" },
      { id:"f11", month:3,  city:"Emmenbrücke",              canton:"Lucerne",         age:null, ageKnown:false, note:"Fille — âge inconnu. Mère et fille tuées lors du même incident" },
      { id:"f12", month:3,  city:"Worb",                     canton:"Berne",           age:33,   ageKnown:true,  note:null },
      { id:"f13", month:4,  city:"Münchwilen",               canton:"Thurgovie",       age:47,   ageKnown:true,  note:null },
      { id:"f14", month:4,  city:"Epagny",                   canton:"Fribourg",        age:null, ageKnown:false, note:null },
      { id:"f15", month:4,  city:"Lyss",                     canton:"Berne",           age:70,   ageKnown:true,  note:null },
      { id:"f16", month:6,  city:"Martigny-Croix",           canton:"Valais",          age:50,   ageKnown:true,  note:null },
      { id:"f17", month:6,  city:"Egerkingen",               canton:"Soleure",         age:null, ageKnown:false, note:"Deux femmes tuées lors du même incident" },
      { id:"f18", month:6,  city:"Egerkingen",               canton:"Soleure",         age:null, ageKnown:false, note:"Deux femmes tuées lors du même incident" },
      { id:"f19", month:7,  city:"Givisiez",                 canton:"Fribourg",        age:30,   ageKnown:true,  note:null },
      { id:"f20", month:8,  city:"Corcelles",                canton:"Neuchâtel",       age:47,   ageKnown:true,  note:"Mère et ses deux filles tuées lors du même incident" },
      { id:"f21", month:8,  city:"Corcelles",                canton:"Neuchâtel",       age:10,   ageKnown:true,  note:"Fille — tuée avec sa mère et sa sœur" },
      { id:"f22", month:8,  city:"Corcelles",                canton:"Neuchâtel",       age:3,    ageKnown:true,  note:"Fille — tuée avec sa mère et sa sœur" },
      { id:"f23", month:8,  city:"Neuhausen am Rheinfall",   canton:"Schaffhouse",     age:47,   ageKnown:true,  note:null },
      { id:"f24", month:8,  city:"Rorschach",                canton:"Saint-Gall",      age:42,   ageKnown:true,  note:null },
      { id:"f25", month:9,  city:"Wettswil am Albis",        canton:"Zürich",          age:78,   ageKnown:true,  note:null },
      { id:"f26", month:11, city:"Lausanne",                 canton:"Vaud",            age:null, ageKnown:false, note:null },
      { id:"f27", month:11, city:"Truttikon",                canton:"Zürich",          age:65,   ageKnown:true,  note:null },
    ],
  };

  // ── Build ──────────────────────────────────────────────────────────────────
  function build() {
    const container = document.getElementById("féminicide");
    if (!container) return console.warn("#féminicide introuvable");

    // ── CSS ──────────────────────────────────────────────────────────────────
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

      #féminicide {
        position: relative;
        width: 100%;
        height: 400vh;
        background: #f2ece0;
        font-family: 'Lora', Georgia, serif;
      }
      .fm-sticky {
        position: sticky;
        top: 0; width: 100%; height: 100vh;
        overflow: hidden;
      }

      /* ── Panneau texte gauche ── */
      .fm-text {
        position: absolute;
        top: 0; left: 0;
        width: 40%; height: 100%;
        background: #f2ece0;
        z-index: 100;
        display: flex; flex-direction: column;
        justify-content: center;
        padding: 3rem 2rem 3rem 4rem;
        box-sizing: border-box;
      }
      .fm-text::after {
        content: '';
        position: absolute; top:0; right:-60px;
        width:60px; height:100%;
        background: linear-gradient(to right, #f2ece0, transparent);
        pointer-events: none;
      }
      .fm-eyebrow {
        font-size: 0.62rem; letter-spacing:0.22em;
        text-transform: uppercase; color:#9a8060;
        margin-bottom:1rem;
        opacity:0; transform:translateY(8px);
        transition: opacity 0.45s, transform 0.45s;
      }
      .fm-headline {
        font-size: clamp(1.4rem, 2.5vw, 2.2rem);
        font-weight:600; color:#1a1208;
        line-height:1.2; margin-bottom:1.4rem;
        opacity:0; transform:translateY(10px);
        transition: opacity 0.45s 0.07s, transform 0.45s 0.07s;
      }
      .fm-body {
        font-size: clamp(0.82rem, 1.1vw, 0.95rem);
        color:#3a3020; line-height:1.8;
        opacity:0; transform:translateY(8px);
        transition: opacity 0.45s 0.14s, transform 0.45s 0.14s;
      }
      .fm-body em    { font-style:italic; color:#5a4830; }
      .fm-body strong{ font-weight:600; color:#1a1208; }
      .fm-note {
        margin-top:1.4rem; font-size:0.78rem;
        color:#7a6848; line-height:1.7; font-style:italic;
        border-left:3px solid #8b3a3a; padding-left:1rem;
        opacity:0; transform:translateY(6px);
        transition: opacity 0.45s 0.21s, transform 0.45s 0.21s;
      }
      .fm-text.visible .fm-eyebrow,
      .fm-text.visible .fm-headline,
      .fm-text.visible .fm-body,
      .fm-text.visible .fm-note { opacity:1; transform:translateY(0); }

      /* ── Zone droite ── */
      .fm-viz {
        position: absolute;
        top:0; left:40%;
        width:60%; height:100%;
        overflow:hidden; z-index:1;
      }

      /* ── Grille de fleurs ── */
      .fm-grid {
        position: absolute;
        top:0; left:0; right:0; bottom:0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;
      }
      .fm-grid-inner {
        display: flex;
        flex-wrap: wrap;
        gap: clamp(4px, 1.5vw, 14px);
        justify-content: center;
        align-items: flex-end;  /* toutes les tiges touchent la même ligne */
        padding: 1rem 2rem 3rem;
        max-width: 600px;
      }

      /* ── Fleur fanée ── */
      .fm-flower {
        position: relative;
        cursor: pointer;
        opacity: 0;
        transform: translateY(12px);
        transition: opacity 0.6s ease, transform 0.6s ease;
        flex-shrink: 0;
      }
      .fm-flower:hover {
        z-index: 20;
      }
      .fm-flower svg {
        display: block;
      }
      .fm-flower:hover .fm-tooltip { opacity:1; pointer-events:auto; }
      .fm-flower svg { display:block; overflow:visible; }

      /* ── Tooltip au hover ── */
      .fm-tooltip {
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        background: #1a1208;
        color: #f2ece0;
        font-size: 0.65rem;
        line-height: 1.6;
        padding: 0.6rem 0.9rem;
        border-radius: 3px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;
        z-index: 50;
        font-family: 'Lora', Georgia, serif;
      }
      .fm-tooltip::after {
        content: '';
        position: absolute;
        top:100%; left:50%;
        transform: translateX(-50%);
        border:5px solid transparent;
        border-top-color: #1a1208;
      }
      .fm-tooltip .tip-city   { font-weight:600; font-size:0.72rem; }
      .fm-tooltip .tip-age    { color:#c4a070; }
      .fm-tooltip .tip-note   { font-style:italic; color:#b0a080; margin-top:2px; font-size:0.6rem; }

      /* ── Compteur ── */
      .fm-counter {
        position: absolute;
        bottom: 2.5rem; right: 2.5rem;
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 600; color: #1a1208;
        z-index:10; pointer-events:none;
        opacity:0; transition: opacity 0.5s;
        line-height:1;
      }
      .fm-counter-label {
        display: block;
        font-size:0.65rem; font-weight:400;
        letter-spacing:0.12em; text-transform:uppercase;
        color:#8b3a3a; margin-top:4px;
      }



      /* Source */
      .fm-source {
        position:absolute; bottom:1.2rem; right:1.5rem;
        font-size:0.56rem; color:#b0a080; font-style:italic;
        z-index:200; pointer-events:none;
      }
    `;
    document.head.appendChild(style);

    // ── DOM ──────────────────────────────────────────────────────────────────
    const sticky = document.createElement("div");
    sticky.className = "fm-sticky";
    container.appendChild(sticky);

    // Panneau texte
    const textPanel = document.createElement("div");
    textPanel.className = "fm-text";
    textPanel.innerHTML = `
      <div class="fm-eyebrow"  id="fm-eyebrow">Féminicides en Suisse</div>
      <div class="fm-headline" id="fm-headline">Carole aurait eu 36 ans.<br>Elle aurait dû pouvoir vivre.</div>
      <div class="fm-body"     id="fm-body">En 2025, <strong>27 femmes</strong> ont été tuées en Suisse.<br><br>
        Chaque fleur représente une vie.<br>
        Passez votre souris sur une fleur<br>pour voir qui elle était.</div>
      <div class="fm-note"     id="fm-note">Ces données sont partielles et évolutives.<br>
        Certains incidents comptent plusieurs victimes.</div>
    `;
    sticky.appendChild(textPanel);

    // Zone droite
    const viz = document.createElement("div");
    viz.className = "fm-viz";
    sticky.appendChild(viz);

    // Source
    const srcEl = document.createElement("div");
    srcEl.className = "fm-source";
    srcEl.textContent = DATA.source;
    sticky.appendChild(srcEl);

    // Compteur
    const counter = document.createElement("div");
    counter.className = "fm-counter";
    counter.innerHTML = `${DATA.totalVictims}<span class="fm-counter-label">femmes tuées en 2025</span>`;
    viz.appendChild(counter);

    // ── Grille de fleurs ─────────────────────────────────────────────────────
    const grid = document.createElement("div");
    grid.className = "fm-grid";
    const gridInner = document.createElement("div");
    gridInner.className = "fm-grid-inner";
    grid.appendChild(gridInner);
    viz.appendChild(grid);

    // ── SVG fleur fanée ───────────────────────────────────────────────────────
    // Chaque fleur est légèrement différente (seed PRNG)
    function rng32(seed) {
      return () => {
        seed |= 0; seed = seed + 0x6d2b79f5 | 0;
        let t = Math.imul(seed ^ seed>>>15, 1|seed);
        t = t + Math.imul(t ^ t>>>7, 61|t) ^ t;
        return ((t ^ t>>>14) >>> 0) / 4294967296;
      };
    }

    function makeWiltedFlower(seed) {
      const r = rng32(seed);

      // Variantes
      const stemH    = 60 + r() * 35;
      const curveAmt = (r() - 0.5) * 18;      // courbure latérale tige
      const tiltDir  = r() > 0.5 ? 1 : -1;    // direction du penchement
      const tiltAmt  = 0.18 + r() * 0.28;     // à quel point la tête penche
      const N        = 5 + Math.floor(r() * 3);// nb pétales
      const petalL   = 14 + r() * 10;
      const headR    = 5  + r() * 3;
      const hasLeaf  = r() > 0.35;
      const leafPos  = 0.3 + r() * 0.3;
      const leafSide = r() > 0.5 ? 1 : -1;

      const W = 60, H = Math.ceil(stemH + petalL + headR + 20);
      const bx = W / 2, by = H - 6;

      // Haut de tige (col)
      const tx = bx + curveAmt;
      const ty = by - stemH;

      // Tête penchée — décalage latéral + légèrement vers le haut
      const hx = tx + tiltDir * tiltAmt * (petalL + headR) * 1.2;
      const hy = ty - (1 - tiltAmt) * headR * 1.5;

      // ── Tige
      const stemD = `M${bx} ${by} C${bx + curveAmt*0.3} ${by - stemH*0.4}, ${tx - curveAmt*0.1} ${ty + stemH*0.25}, ${tx} ${ty}`;

      // ── Col courbé vers la tête
      const neckD = `M${tx} ${ty} Q${tx + tiltDir*tiltAmt*(petalL*0.5)} ${ty - headR*0.8}, ${hx} ${hy}`;

      // ── Feuille optionnelle
      let leafSVG = "";
      if (hasLeaf) {
        const lx = bx + (tx - bx) * leafPos + curveAmt * leafPos * 0.5;
        const ly = by + (ty - by) * leafPos;
        const lLen = 10 + r() * 8;
        const lAngle = leafSide * (0.5 + r() * 0.4);
        const lex = lx + Math.cos(lAngle) * lLen;
        const ley = ly + Math.sin(lAngle) * lLen + lLen * 0.35;
        leafSVG = `<path d="M${lx.toFixed(1)} ${ly.toFixed(1)} Q${((lx+lex)/2).toFixed(1)} ${(Math.min(ly,ley)+2).toFixed(1)} ${lex.toFixed(1)} ${ley.toFixed(1)}"
          stroke="#6a5a3a" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.55"/>`;
      }

      // ── Pétales : forme de tulipe fanée
      // Chaque pétale = ellipse allongée qui part du bas de la tête et tombe
      let petalsSVG = "";
      for (let i = 0; i < N; i++) {
        // Angle de base : réparti sur ~180° vers le bas, centré sur la direction de chute
        const spread = Math.PI * 0.85;
        const center = Math.PI * 0.5 + tiltDir * 0.4; // vers le bas + légèrement du côté du penchement
        const a = center - spread/2 + (i / (N - 1)) * spread + (r()-0.5)*0.15;

        const pL  = petalL * (0.7 + r() * 0.5);
        const pW  = 3 + r() * 2.5;
        const op  = (0.5 + r() * 0.45).toFixed(2);

        // Départ : bord bas de la tête
        const sx = hx + Math.cos(a + Math.PI) * headR * 0.8;
        const sy = hy + Math.sin(a + Math.PI) * headR * 0.8;

        // Courbe du pétale : s'incurve puis retombe
        const cp1x = sx + Math.cos(a) * pL * 0.35 + (r()-0.5)*3;
        const cp1y = sy + Math.sin(a) * pL * 0.35 - pL * 0.05;
        const cp2x = sx + Math.cos(a) * pL * 0.75 + (r()-0.5)*3;
        const cp2y = sy + Math.sin(a) * pL * 0.75 + pL * 0.12;
        const ex   = sx + Math.cos(a) * pL;
        const ey   = sy + Math.sin(a) * pL + pL * 0.08;

        petalsSVG += `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} C${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}"
          stroke="#8b3035" stroke-width="${pW.toFixed(1)}" stroke-linecap="round" fill="none" opacity="${op}"/>`;
      }

      // ── Sépales : 2-3 petites lignes sous la tête
      let sepalsSVG = "";
      const nSep = 2 + Math.floor(r()*2);
      for (let i = 0; i < nSep; i++) {
        const sa = (Math.PI * 0.3) + i * (Math.PI * 0.2) + tiltDir * 0.3;
        const sL = 5 + r() * 4;
        const sex = hx + Math.cos(sa) * headR + Math.cos(sa) * sL;
        const sey = hy + Math.sin(sa) * headR + Math.sin(sa) * sL + sL * 0.2;
        sepalsSVG += `<path d="M${(hx + Math.cos(sa)*headR).toFixed(1)} ${(hy + Math.sin(sa)*headR).toFixed(1)} L${sex.toFixed(1)} ${sey.toFixed(1)}"
          stroke="#6a5a3a" stroke-width="1" stroke-linecap="round" opacity="0.5"/>`;
      }

      return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${leafSVG}
        <path d="${stemD}" stroke="#6a5a3a" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="${neckD}" stroke="#6a5a3a" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        ${sepalsSVG}
        ${petalsSVG}
        <circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="${headR}" fill="#8b3035" opacity="0.8"/>
        <circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="${(headR*0.4).toFixed(1)}" fill="#f2ece0" opacity="0.5"/>
      </svg>`;
    }

        // ── Créer les fleurs ──────────────────────────────────────────────────────
    const flowerEls = DATA.victims.map((v, i) => {
      const wrap = document.createElement("div");
      wrap.className = "fm-flower";
      wrap.innerHTML = makeWiltedFlower(i * 23 + 7);

      // Tooltip
      const tooltip = document.createElement("div");
      tooltip.className = "fm-tooltip";
      const ageStr = v.ageKnown && v.age !== null ? `${v.age} ans` : "Âge inconnu";
      const dateObj = new Date(v.date || `2025-${v.month}-01`);
      const monthName = DATA.byMonth.find(m => m.month === v.month)?.label || "";
      tooltip.innerHTML = `
        <div class="tip-city">${v.city}, ${v.canton}</div>
        <div class="tip-age">${ageStr} — ${monthName} 2025</div>
        ${v.note ? `<div class="tip-note">${v.note}</div>` : ""}
      `;
      wrap.appendChild(tooltip);
      gridInner.appendChild(wrap);
      return wrap;
    });



    // ── Narration ─────────────────────────────────────────────────────────────
    const scenes = [
      {
        eyebrow:  "Féminicides en Suisse — 2025",
        headline: "Carole aurait eu 36 ans.<br>Elle aurait dû pouvoir vivre.",
        body:     `En 2025, <strong>27 femmes</strong> ont été tuées en Suisse.<br><br>
                   Chaque fleur représente une vie.<br>
                   Passez votre souris sur une fleur<br>pour voir qui elle était.`,
        note:     `Ces données sont partielles et évolutives.<br>
                   Certains incidents comptent plusieurs victimes.`,
      },

    ];

    function setScene(idx) {
      const s = scenes[idx];
      textPanel.classList.remove("visible");
      setTimeout(() => {
        document.getElementById("fm-eyebrow").textContent = s.eyebrow;
        document.getElementById("fm-headline").innerHTML  = s.headline;
        document.getElementById("fm-body").innerHTML      = s.body;
        document.getElementById("fm-note").innerHTML      = s.note;
        textPanel.classList.add("visible");
      }, 200);
    }

    // ── ScrollTrigger 1 : apparition des fleurs (0%→55%) ─────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "80% top",
      scrub: 2,
      onEnter() { setScene(0); },
      onUpdate(self) {
        const p = self.progress;
        counter.style.opacity = String(Math.min(1, p * 3));

        // Les fleurs apparaissent une à une, légèrement décalées
        flowerEls.forEach((el, i) => {
          const threshold = i / flowerEls.length * 0.85;
          const localP = Math.max(0, Math.min(1, (p - threshold) / 0.15));
          el.style.opacity   = String(localP);
          el.style.transform = `scale(${0.4 + localP*0.6}) translateY(${(1-localP)*20}px)`;
        });
      },
      onLeaveBack() {
        flowerEls.forEach(el => {
          el.style.opacity = "0";
          el.style.transform = "scale(0.4) translateY(20px)";
        });
        counter.style.opacity = "0";
      },
    });



    // ── Init ──────────────────────────────────────────────────────────────────
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTimeout(() => { textPanel.classList.add("visible"); }, 350);
    }));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
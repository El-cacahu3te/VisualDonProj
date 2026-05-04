/**
 * src/section/toys.js — Scrollytelling "Jeux des enfants selon leur sexe"
 * Vite + ES module — importé depuis src/main.js
 * GSAP + ScrollTrigger injectés automatiquement depuis le CDN
 * Cible : <div id="lesJouets">
 */

export default function initToys() {

  // ─── 0. GSAP + ScrollTrigger ───────────────────────────────────────────────
  function loadScript(src, onload) {
    const s = document.createElement("script");
    s.src = src; s.onload = onload;
    document.head.appendChild(s);
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
      @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

      #lesJouets {
        position: relative;
        width: 100%;
        height: 700vh;
        background: #f5f0e8;
        font-family: 'Lora', Georgia, serif;
      }

      /* ── Scène sticky ── */
      .toys-sticky-scene {
        position: sticky;
        top: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      /* ── Potager : sol élégant ── */
      .toys-garden {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 15%;
        z-index: 3;
        overflow: hidden;
      }
      /* Couche terre principale */
      .toys-garden-soil {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top,
          #5c3d1e 0%,
          #7a5230 18%,
          #9a6e42 40%,
          #b88a58 62%,
          #d4aa78 82%,
          rgba(212,170,120,0) 100%
        );
      }
      /* Sillon horizontal (lignes de plantation) */
      .toys-garden-rows {
        position: absolute;
        inset: 0;
        background:
          repeating-linear-gradient(
            to top,
            rgba(80,50,20,0.18) 0px, rgba(80,50,20,0.18) 1px,
            transparent 1px, transparent 18px
          );
      }
      /* Bord supérieur herbe */
      .toys-garden-grass {
        position: absolute;
        top: -8px; left: 0; right: 0;
        height: 16px;
        overflow: hidden;
      }
      /* Reflet de lumière douce */
      .toys-garden-light {
        position: absolute;
        top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg,
          transparent 0%,
          rgba(255,210,120,0.0) 10%,
          rgba(255,210,120,0.4) 35%,
          rgba(255,225,150,0.6) 50%,
          rgba(255,210,120,0.4) 65%,
          rgba(255,210,120,0.0) 90%,
          transparent 100%
        );
      }
      /* Reflet lumineux sur la terre */
      .toys-garden::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg,
          transparent 0%,
          rgba(255,220,140,0.35) 20%,
          rgba(255,220,140,0.55) 50%,
          rgba(255,220,140,0.35) 80%,
          transparent 100%
        );
      }

      /* ── Canvas pousses ── */
      .toys-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
      }

      /* ── Labels clusters ── */
      .toys-cluster-label {
        position: absolute;
        font-size: clamp(0.6rem, 0.85vw, 0.78rem);
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #8a7a60;
        pointer-events: none;
        transform: translateX(-50%);
        white-space: nowrap;
        transition: opacity 0.6s ease;
      }


      /* ── Zone de texte : panneau gauche ── */
      .toys-text-panel {
        position: absolute;
        top: 0; left: 0;
        width: min(380px, 38%);
        height: 82%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2.5rem 2.5rem 2.5rem 3rem;
        z-index: 20;
        pointer-events: none;
        /* Fond légèrement opaque pour garantir lisibilité même si une pousse déborde */
        background: linear-gradient(to right,
          rgba(245,240,232,1) 0%,
          rgba(245,240,232,0.97) 75%,
          rgba(245,240,232,0) 100%
        );
      }
      .toys-eyebrow {
        font-size: 0.65rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #9a8a70;
        margin-bottom: 0.8rem;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      .toys-headline {
        font-size: clamp(1.3rem, 2.2vw, 1.8rem);
        font-weight: 600;
        color: #1a1a1a;
        line-height: 1.3;
        margin-bottom: 1rem;
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.5s ease 0.08s, transform 0.5s ease 0.08s;
      }
      .toys-body {
        font-size: clamp(0.78rem, 1.05vw, 0.9rem);
        color: #4a4035;
        line-height: 1.75;
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.5s ease 0.16s, transform 0.5s ease 0.16s;
      }
      .toys-body em {
        font-style: italic;
        color: #6a5a40;
      }
      .toys-body strong {
        font-weight: 600;
        color: #2a2018;
      }
      .toys-note {
        margin-top: 1.2rem;
        font-size: 0.72rem;
        color: #9a8a70;
        line-height: 1.6;
        font-style: italic;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 0.5s ease 0.24s, transform 0.5s ease 0.24s;
        border-left: 2px solid #c4a97a;
        padding-left: 0.8rem;
      }
      .toys-text-panel.visible .toys-eyebrow,
      .toys-text-panel.visible .toys-headline,
      .toys-text-panel.visible .toys-body,
      .toys-text-panel.visible .toys-note {
        opacity: 1;
        transform: translateY(0);
      }

      /* ── Source ── */
      .toys-source {
        position: absolute;
        bottom: 20%;
        right: 1.5rem;
        font-size: 0.6rem;
        color: #b0a090;
        font-style: italic;
        z-index: 10;
        pointer-events: none;
      }

      /* ── Badges stats scène 3 ── */
      .toys-stat-badge {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        pointer-events: none;
        transform: translateX(-50%);
        transition: opacity 0.5s ease;
        background: rgba(245,240,232,0.88);
        border: 1px solid #c4a97a;
        border-radius: 6px;
        padding: 0.5rem 0.9rem;
      }
      .toys-stat-number {
        font-size: clamp(0.8rem, 1.4vw, 1.1rem);
        font-weight: 600;
        color: #1a1a1a;
        white-space: nowrap;
        font-family: 'Lora', serif;
      }
      .toys-stat-sub {
        font-size: 0.6rem;
        color: #8a7a60;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      /* ── Pousses ── */
      .sprout-el {
        position: absolute;
        will-change: transform, opacity;
        transform-origin: bottom center;
        cursor: default;
        transition: color 0.4s ease;
        z-index: 4; /* au-dessus du sol */
      }
      .sprout-el svg {
        display: block;
        overflow: visible;
      }

      /* ── Indicateur de scroll ── */
      .toys-scroll-hint {
        position: absolute;
        bottom: 21%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        z-index: 10;
        pointer-events: none;
        opacity: 1;
        transition: opacity 0.4s;
      }
      .toys-scroll-hint span {
        font-size: 0.6rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #9a8a70;
      }
      .toys-scroll-arrow {
        width: 20px; height: 20px;
        border-right: 1.5px solid #9a8a70;
        border-bottom: 1.5px solid #9a8a70;
        transform: rotate(45deg);
        animation: toysBounce 1.4s ease-in-out infinite;
      }
      @keyframes toysBounce {
        0%, 100% { transform: rotate(45deg) translateY(0); }
        50%       { transform: rotate(45deg) translateY(4px); }
      }
    `;
    document.head.appendChild(style);

    // ── DOM principal ─────────────────────────────────────────────────────────
    const sticky = document.createElement("div");
    sticky.className = "toys-sticky-scene";
    container.appendChild(sticky);

    // Sol / potager — plusieurs couches pour un rendu naturel
    const garden = document.createElement("div");
    garden.className = "toys-garden";

    const soil = document.createElement("div");
    soil.className = "toys-garden-soil";
    garden.appendChild(soil);

    const rows = document.createElement("div");
    rows.className = "toys-garden-rows";
    garden.appendChild(rows);

    const grass = document.createElement("div");
    grass.className = "toys-garden-grass";
    // Brins d'herbe en SVG inline
    grass.innerHTML = `<svg width="100%" height="16" viewBox="0 0 1440 16" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({length: 120}, (_, i) => {
        const x = (i / 120) * 1440 + (Math.sin(i * 2.3) * 4);
        const h = 5 + Math.abs(Math.sin(i * 1.7)) * 9;
        const lean = (Math.sin(i * 0.9) * 3);
        const shade = Math.floor(60 + Math.abs(Math.sin(i*0.4)) * 40);
        return `<path d="M${x} 16 Q${x+lean} ${16-h*0.6} ${x+lean*1.5} ${16-h}" stroke="rgb(${shade},${shade+40},${Math.floor(shade*0.4)})" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="${0.5 + Math.abs(Math.sin(i*1.1))*0.5}"/>`;
      }).join('')}
    </svg>`;
    garden.appendChild(grass);

    const light = document.createElement("div");
    light.className = "toys-garden-light";
    garden.appendChild(light);

    sticky.appendChild(garden);

    // Canvas pousses
    const canvas = document.createElement("div");
    canvas.className = "toys-canvas";
    sticky.appendChild(canvas);

    // Panneau texte
    const panel = document.createElement("div");
    panel.className = "toys-text-panel";
    panel.innerHTML = `
      <div class="toys-eyebrow" id="t-eyebrow">Scène 1 · Un jardin libre</div>
      <div class="toys-headline" id="t-headline">Et si les enfants choisissaient librement&nbsp;?</div>
      <div class="toys-body" id="t-body">Dans ce jardin, chaque pousse représente un enfant de 2 ans.<br><br>
        Elles se répartissent naturellement autour de trois centres d'intérêt :<br>
        <em>prendre soin</em>, <em>agir</em>, <em>construire</em>.<br><br>
        Rien ne distingue les filles des garçons.</div>
      <div class="toys-note" id="t-note">63% des filles <strong>et</strong> 52% des garçons jouent avec des peluches.<br>
        57% des filles jouent à la balle.<br>
        Les intérêts se recoupent largement.</div>
    `;
    sticky.appendChild(panel);

    // Source
    const src = document.createElement("div");
    src.className = "toys-source";
    src.textContent = "Ined – Données 2013-2014 – © Observatoire des inégalités";
    sticky.appendChild(src);

    // Indicateur scroll
    const hint = document.createElement("div");
    hint.className = "toys-scroll-hint";
    hint.id = "toys-scroll-hint";
    hint.innerHTML = `<span>Scroll</span><div class="toys-scroll-arrow"></div>`;
    sticky.appendChild(hint);

    setTimeout(() => panel.classList.add("visible"), 400);

    // ── Dimensions ───────────────────────────────────────────────────────────
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // ── Clusters (dans la zone canvas = 82% de la hauteur) ───────────────────
    // rx relatif à la largeur totale, ry relatif à la hauteur du canvas
    const CLUSTERS = {
      care:   { rx: 0.62, ry: 0.28, label: "Soin" },
      action: { rx: 0.85, ry: 0.28, label: "Action" },
      logic:  { rx: 0.74, ry: 0.60, label: "Construction & logique" },
    };

    // ── Positions jouets ─────────────────────────────────────────────────────
    const TOY_POS = {
      poupee:           { rx: 0.54, ry: 0.20 },
      peluches:         { rx: 0.62, ry: 0.44 },
      dessins:          { rx: 0.68, ry: 0.28 },
      balle:            { rx: 0.80, ry: 0.22 },
      petites_voitures: { rx: 0.90, ry: 0.20 },
      puzzles:          { rx: 0.66, ry: 0.58 },
      jeux_empiler:     { rx: 0.78, ry: 0.58 },
      jeux_bain:        { rx: 0.74, ry: 0.74 },
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
        el.style.top  = (c.ry * H() - 44) + "px";
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
        el.style.top  = (p.ry * H() - 80) + "px";
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

    // ── SVG pousse — taille variable via scale ────────────────────────────────
    // Toutes les pousses ont la même base SVG, la taille varie via CSS transform
    function makeSproutSVG(seed) {
      const r = mulberry32(seed);
      const stemH   = 32 + r() * 20;       // tige
      const sway    = (r() - 0.5) * 10;    // courbure
      const leafW   = 8  + r() * 7;
      const leafH   = 11 + r() * 9;
      const leafRot = -25 + r() * 50;
      const blobRx  = 4  + r() * 5;        // bourgeon elliptique
      const blobRy  = blobRx * (1.1 + r() * 0.5);
      const w = 44;
      const h = Math.ceil(stemH + blobRy * 2 + 8);
      const cx = w / 2;
      // Ancrage = bas du SVG → la pousse "pousse" vers le haut
      return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- tige courbée -->
        <path d="M${cx} ${h} Q${cx+sway*0.8} ${h-stemH*0.55} ${cx+sway*0.3} ${h-stemH}"
              stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        <!-- feuille gauche -->
        <ellipse cx="${cx - leafW*0.8 + sway*0.15}" cy="${h - stemH*0.52}"
                 rx="${leafW*0.75}" ry="${leafH*0.38}"
                 transform="rotate(${-35+leafRot} ${cx-leafW*0.8} ${h-stemH*0.52})"
                 fill="currentColor" opacity="0.55"/>
        <!-- feuille droite -->
        <ellipse cx="${cx + leafW*0.8 + sway*0.15}" cy="${h - stemH*0.38}"
                 rx="${leafW*0.65}" ry="${leafH*0.32}"
                 transform="rotate(${25-leafRot*0.6} ${cx+leafW*0.8} ${h-stemH*0.38})"
                 fill="currentColor" opacity="0.45"/>
        <!-- bourgeon -->
        <ellipse cx="${cx + sway*0.3}" cy="${h - stemH - blobRy}"
                 rx="${blobRx}" ry="${blobRy}"
                 fill="currentColor"/>
        <!-- petite nervure centrale bourgeon -->
        <line x1="${cx+sway*0.3}" y1="${h-stemH-blobRy*1.6}"
              x2="${cx+sway*0.3}" y2="${h-stemH-blobRy*0.4}"
              stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
      </svg>`;
    }

    // ── Scatter stable autour d'un cluster ou jouet ──────────────────────────
    const rng = mulberry32(42);
    const scatterCache = {};
    function getScatter(id) {
      if (!scatterCache[id]) scatterCache[id] = { dx: (rng()-0.5)*0.12, dy: (rng()-0.5)*0.09 };
      return scatterCache[id];
    }
    const MIN_RX = 0.44; // jamais sur le panneau texte (0-38%)

    function freePosOf(sp) {
      const c = CLUSTERS[sp.freeCluster];
      const s = getScatter(sp.id);
      return { rx: Math.max(MIN_RX, c.rx + s.dx), ry: c.ry + s.dy };
    }
    function toyPosOf(sp) {
      const base = TOY_POS[sp.freedToy] || { rx: 0.7, ry: 0.5 };
      const s = getScatter(sp.id);
      return { rx: Math.max(MIN_RX, base.rx + s.dx*0.35), ry: base.ry + s.dy*0.35 };
    }

    // ── Placer une pousse (ancre = bas de la SVG au sol visuel) ──────────────
    // Toutes les pousses "poussent" depuis le bas du canvas (sol)
    // En scène libre elles sont à leur ry naturel
    // En scène genrée elles gardent leur ry cible mais leur scale augmente
    function placeSprout(el, rx, ry, sc) {
      const w = el.offsetWidth  || 44;
      const h = el.offsetHeight || 60;
      const scale = sc !== undefined ? sc : parseFloat(el.dataset.scale || "1");
      gsap.set(el, {
        x: rx * W() - w / 2,
        y: ry * H() - h,   // ancré en bas
        scale: scale,
      });
      el.dataset.scale = String(scale);
    }

    // ── Est-ce que la pousse est mal placée ? ────────────────────────────────
    function isMismatched(sp) {
      const toy = DATA.toys.find(t => t.id === sp.freedToy);
      return toy && toy.cluster !== sp.freeCluster;
    }

    // ── Créer les pousses ────────────────────────────────────────────────────
    const sproutEls = DATA.sprouts.map((sp, i) => {
      const el = document.createElement("div");
      el.className = "sprout-el";
      el.innerHTML = makeSproutSVG(i * 17 + 3);
      el.dataset.scale = "0.55"; // petites au départ (enfants de 2 ans)
      canvas.appendChild(el);
      return { el, sp };
    });

    // ── Texte ─────────────────────────────────────────────────────────────────
    const scenes = [
      {
        eyebrow:  "Scène 1 · Un jardin libre",
        headline: "Et si les enfants choisissaient librement&nbsp;?",
        body:     `Dans ce jardin, chaque pousse représente un enfant de 2 ans.<br><br>
                   Elles se répartissent naturellement autour de trois centres d'intérêt :<br>
                   <em>prendre soin</em>, <em>agir</em>, <em>construire</em>.<br><br>
                   Rien ne distingue les filles des garçons.`,
        note:     `63% des filles <strong>et</strong> 52% des garçons jouent avec des peluches.<br>
                   57% des filles jouent à la balle.<br>
                   Les intérêts se recoupent largement.`,
      },
      {
        eyebrow:  "Scène 2 · Le jouet leur est imposé",
        headline: "Puis quelque chose change.",
        body:     `Les pousses grandissent — et les jouets deviennent genrés.<br><br>
                   Certaines pousses se grisent&nbsp;: elles quittent ce qui les attirait.<br><br>
                   Elles ne disparaissent pas.<br>
                   <strong>Elles sont redirigées.</strong>`,
        note:     `Ce que vous voyez n'est pas un changement naturel des goûts.<br>
                   C'est l'effet des jouets proposés, des attentes sociales,<br>
                   des normes implicites.<br>
                   Les enfants s'adaptent à ce qu'on attend d'eux.`,
      },
      {
        eyebrow:  "Scène 3 · L'écart le plus fort",
        headline: "Ce ne sont plus des préférences.<br>Ce sont des écarts.",
        body:     `Les différences deviennent massives.<br><br>
                   Elles ne reflètent plus une curiosité naturelle.<br>
                   Elles traduisent <strong>une assignation</strong>.`,
        note:     `Un enfant sur deux change de trajectoire.<br>
                   Pas parce qu'il en a envie.<br>
                   <em>Parce que son environnement l'y pousse.</em>`,
      },
    ];

    function setScene(idx) {
      const s = scenes[idx];
      panel.classList.remove("visible");
      setTimeout(() => {
        document.getElementById("t-eyebrow").textContent  = s.eyebrow;
        document.getElementById("t-headline").innerHTML   = s.headline;
        document.getElementById("t-body").innerHTML       = s.body;
        document.getElementById("t-note").innerHTML       = s.note;
        panel.classList.add("visible");
      }, 180);
    }

    // ── Init scène 0 ─────────────────────────────────────────────────────────
    function initScene() {
      positionClusterLabels();
      positionStatBadges();

      sproutEls.forEach(({ el, sp }) => {
        const pos = freePosOf(sp);
        placeSprout(el, pos.rx, pos.ry, 0.55);
        gsap.set(el, { color: "#4caf50", opacity: 1 });
      });

      Object.values(clusterLabelEls).forEach(el => { el.style.opacity = "1"; });
      Object.values(statBadges).forEach(el => { el.style.opacity = "0"; });
    }

    // ── ScrollTrigger 1 : libre → genré (scroll 0%→40%) ──────────────────────
    // Les pousses bougent ET grandissent
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "40% top",
      scrub: 2,
      onUpdate(self) {
        const p = self.progress;

        // Cacher hint de scroll
        const hint = document.getElementById("toys-scroll-hint");
        if (hint) hint.style.opacity = String(1 - p * 3);

        sproutEls.forEach(({ el, sp }) => {
          const fp = freePosOf(sp);
          const tp = toyPosOf(sp);

          // Position interpolée
          const rx = fp.rx + (tp.rx - fp.rx) * p;
          const ry = fp.ry + (tp.ry - fp.ry) * p;

          // Scale : de 0.55 (petits) → 0.85 (plus grands)
          const sc = 0.55 + 0.30 * p;

          placeSprout(el, rx, ry, sc);

          // Couleur : vert vif → gris pour les mal-placés
          if (isMismatched(sp)) {
            const gr = Math.round(76  + (155 - 76)  * p);
            const gg = Math.round(175 + (155 - 175) * p);
            const gb = Math.round(80  + (155 - 80)  * p);
            el.style.color = `rgb(${gr},${gg},${gb})`;
            gsap.set(el, { opacity: 1 - p * 0.25 });
          } else {
            // Bien placés : restent verts mais légèrement plus foncés/matures
            const g = Math.round(76 - p * 10);
            const b = Math.round(80 - p * 10);
            el.style.color = `rgb(${g}, ${Math.round(175 - p*20)}, ${b})`;
          }
        });

        // Labels clusters s'effacent progressivement
        Object.values(clusterLabelEls).forEach(el => {
          el.style.opacity = String(Math.max(0, 1 - p * 1.5));
        });
      },
      onEnter()     { setScene(1); },
      onLeaveBack() {
        setScene(0);
        initScene();
        Object.values(clusterLabelEls).forEach(el => { el.style.opacity = "1"; });
      },
    });

    // ── ScrollTrigger 2 : focus écart (scroll 40%→75%) ───────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: "40% top",
      end: "75% top",
      scrub: 2,
      onUpdate(self) {
        const p = self.progress;
        const HL = ["poupee", "petites_voitures"];

        sproutEls.forEach(({ el, sp }) => {
          if (!HL.includes(sp.freedToy)) {
            gsap.set(el, { opacity: Math.max(0.04, 1 - p * 0.96) });
          } else {
            // Les highlighted grandissent encore un peu
            const sc = 0.85 + p * 0.15;
            const pos = toyPosOf(sp);
            placeSprout(el, pos.rx, pos.ry, sc);
            gsap.set(el, { opacity: 1 });
          }
        });

        Object.values(statBadges).forEach(el => { el.style.opacity = String(p); });
      },
      onEnter()     { setScene(2); },
      onLeaveBack() {
        setScene(1);
        sproutEls.forEach(({ el }) => gsap.set(el, { opacity: 1 }));
        Object.values(statBadges).forEach(el => { el.style.opacity = "0"; });
      },
    });

    // ── Resize ───────────────────────────────────────────────────────────────
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        positionClusterLabels();
        positionStatBadges();
        initScene();
        ScrollTrigger.refresh();
      }, 150);
    });

    requestAnimationFrame(() => requestAnimationFrame(initScene));
  }

  // ── Démarrage ──────────────────────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
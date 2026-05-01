/**
 * toys.js — Scrollytelling "Jeux des enfants selon leur sexe"
 * Dépendances injectées automatiquement : GSAP + ScrollTrigger (CDN)
 * Cible : <div id="lesJouets">
 */

(function () {
  // ─── 0. Injecter GSAP + ScrollTrigger si absent ───────────────────────────
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
        () =>
          loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
            () => {
              gsap.registerPlugin(ScrollTrigger);
              build();
            }
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
      { id: "poupee",         label: "Poupée",              cluster: "care",   girls: 81, boys: 19 },
      { id: "peluches",       label: "Peluches",            cluster: "care",   girls: 63, boys: 52 },
      { id: "dessins",        label: "Dessins",             cluster: "care",   girls: 73, boys: 58 },
      { id: "balle",          label: "Balle",               cluster: "action", girls: 57, boys: 76 },
      { id: "petites_voitures", label: "Petites voitures",  cluster: "action", girls: 32, boys: 89 },
      { id: "puzzles",        label: "Puzzles",             cluster: "logic",  girls: 35, boys: 30 },
      { id: "jeux_empiler",   label: "Jeux à empiler",      cluster: "logic",  girls: 54, boys: 61 },
      { id: "jeux_bain",      label: "Jeux de bain",        cluster: "logic",  girls: 84, boys: 86 },
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

    // ── Styles injectés ──────────────────────────────────────────────────────
    const style = document.createElement("style");
    style.textContent = `
      #lesJouets {
        position: relative;
        font-family: 'Georgia', serif;
        background: #f7f4ee;
        overflow: hidden;
      }
      .toys-sticky-wrapper {
        position: relative;
      }
      .toys-sticky-scene {
        position: sticky;
        top: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .toys-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .toys-text-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 2rem 3rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        pointer-events: none;
        z-index: 10;
      }
      .toys-scene-label {
        font-size: clamp(1.1rem, 2vw, 1.5rem);
        font-weight: 600;
        color: #1a1a1a;
        letter-spacing: 0.02em;
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      .toys-scene-desc {
        font-size: clamp(0.78rem, 1.2vw, 0.95rem);
        color: #555;
        max-width: 520px;
        line-height: 1.55;
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
      }
      .toys-source {
        font-size: 0.68rem;
        color: #aaa;
        margin-top: 0.5rem;
        opacity: 0;
        transition: opacity 0.6s ease 0.2s;
      }
      .toys-text-overlay.visible .toys-scene-label,
      .toys-text-overlay.visible .toys-scene-desc,
      .toys-text-overlay.visible .toys-source {
        opacity: 1;
        transform: translateY(0);
      }
      .toys-cluster-label {
        position: absolute;
        font-size: clamp(0.65rem, 1vw, 0.85rem);
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #888;
        pointer-events: none;
        transition: opacity 0.5s;
      }
      .toys-stat-badge {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.5s;
      }
      .toys-stat-number {
        font-size: clamp(1.2rem, 2.5vw, 2rem);
        font-weight: 700;
        color: #1a1a1a;
        line-height: 1;
      }
      .toys-stat-sub {
        font-size: 0.68rem;
        color: #888;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .sprout-el {
        position: absolute;
        will-change: transform, opacity, filter;
        transform-origin: bottom center;
        cursor: default;
      }
    `;
    document.head.appendChild(style);

    // ── DOM ──────────────────────────────────────────────────────────────────
    const scrollHeight = window.innerHeight * 5; // 5 screens de scroll
    container.style.height = scrollHeight + "px";

    const sticky = document.createElement("div");
    sticky.className = "toys-sticky-wrapper";
    sticky.style.height = scrollHeight + "px";
    container.appendChild(sticky);

    const scene = document.createElement("div");
    scene.className = "toys-sticky-scene";
    sticky.appendChild(scene);

    const canvas = document.createElement("div");
    canvas.className = "toys-canvas";
    scene.appendChild(canvas);

    const textOverlay = document.createElement("div");
    textOverlay.className = "toys-text-overlay";
    textOverlay.innerHTML = `
      <span class="toys-scene-label" id="tsl">Un jardin libre</span>
      <span class="toys-scene-desc" id="tsd">50 enfants. Chacun gravite librement autour des centres d'intérêt qui l'attirent. On ne sait pas qui est qui.</span>
      <span class="toys-source">Ined – Données 2013-2014 – © Observatoire des inégalités · Enfants âgés de deux ans.</span>
    `;
    scene.appendChild(textOverlay);

    // ── Layout helpers ────────────────────────────────────────────────────────
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Positions relatives des 3 clusters (valeurs 0-1)
    const CLUSTERS = {
      care:   { rx: 0.22, ry: 0.38, label: "Soin" },
      action: { rx: 0.78, ry: 0.38, label: "Action" },
      logic:  { rx: 0.50, ry: 0.72, label: "Construction & logique" },
    };

    // Positions relatives des jouets
    const TOY_POS = {
      poupee:           { rx: 0.12, ry: 0.25 },
      peluches:         { rx: 0.22, ry: 0.48 },
      dessins:          { rx: 0.30, ry: 0.30 },
      balle:            { rx: 0.70, ry: 0.30 },
      petites_voitures: { rx: 0.86, ry: 0.25 },
      puzzles:          { rx: 0.42, ry: 0.68 },
      jeux_empiler:     { rx: 0.58, ry: 0.68 },
      jeux_bain:        { rx: 0.50, ry: 0.82 },
    };

    // ── Cluster labels ────────────────────────────────────────────────────────
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
        el.style.left = c.rx * W() + "px";
        el.style.top  = (c.ry * H() - 28) + "px";
        el.style.transform = "translateX(-50%)";
      });
    }

    // ── Stat badges (scène 3) ─────────────────────────────────────────────────
    const statBadges = {};
    ["poupee", "petites_voitures"].forEach((tid) => {
      const toy = DATA.toys.find((t) => t.id === tid);
      const el = document.createElement("div");
      el.className = "toys-stat-badge";
      el.id = "badge_" + tid;
      el.innerHTML = `
        <span class="toys-stat-number">${tid === "poupee" ? "81% F · 19% G" : "89% G · 32% F"}</span>
        <span class="toys-stat-sub">${toy.label}</span>
      `;
      canvas.appendChild(el);
      statBadges[tid] = el;
    });

    function positionStatBadges() {
      ["poupee", "petites_voitures"].forEach((tid) => {
        const p = TOY_POS[tid];
        const el = statBadges[tid];
        el.style.left = p.rx * W() + "px";
        el.style.top  = (p.ry * H() - 60) + "px";
        el.style.transform = "translateX(-50%)";
      });
    }

    // ── Génération des pousses SVG ────────────────────────────────────────────
    const rng = mulberry32(42); // seed fixe → formes stables entre renders

    function makeSproutSVG(seed) {
      const r = mulberry32(seed);
      const stemH   = 28 + r() * 18;           // hauteur tige
      const sway    = (r() - 0.5) * 8;         // légère courbure
      const leafW   = 7  + r() * 6;
      const leafH   = 10 + r() * 8;
      const leafRot = -20 + r() * 40;
      const blobR   = 4  + r() * 4;            // "tête" abstraite
      const w = 40, h = stemH + blobR * 2 + 4;

      return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- tige -->
        <path d="M${w/2} ${h} Q${w/2 + sway} ${h - stemH*0.5} ${w/2 + sway*0.3} ${h - stemH}"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <!-- feuille gauche -->
        <ellipse cx="${w/2 - leafW*0.7 + sway*0.2}" cy="${h - stemH*0.55}"
                 rx="${leafW*0.7}" ry="${leafH*0.4}"
                 transform="rotate(${-30 + leafRot} ${w/2 - leafW*0.7} ${h - stemH*0.55})"
                 fill="currentColor" opacity="0.55"/>
        <!-- feuille droite -->
        <ellipse cx="${w/2 + leafW*0.7 + sway*0.2}" cy="${h - stemH*0.4}"
                 rx="${leafW*0.6}" ry="${leafH*0.35}"
                 transform="rotate(${20 - leafRot*0.5} ${w/2 + leafW*0.7} ${h - stemH*0.4})"
                 fill="currentColor" opacity="0.45"/>
        <!-- bourgeon / tête -->
        <ellipse cx="${w/2 + sway*0.3}" cy="${h - stemH - blobR}"
                 rx="${blobR}" ry="${blobR * 1.3}"
                 fill="currentColor"/>
      </svg>`;
    }

    // Positions initiales libres (par cluster) avec léger scatter
    function clusterPos(clusterKey, idx, total) {
      const c = CLUSTERS[clusterKey];
      const angle = (idx / total) * Math.PI * 2;
      const radius = 0.06 + rng() * 0.06; // scatter autour du centre
      return {
        rx: c.rx + Math.cos(angle) * radius * (H() / W()),
        ry: c.ry + Math.sin(angle) * radius * 0.7,
      };
    }

    // Positions vers jouet assigné
    function toyPos(toyId) {
      return TOY_POS[toyId] || { rx: 0.5, ry: 0.5 };
    }

    // ── Créer les éléments sprout ─────────────────────────────────────────────
    const sproutEls = [];
    const clusterCounts = { care: 0, action: 0, logic: 0 };

    DATA.sprouts.forEach((sp) => {
      const el = document.createElement("div");
      el.className = "sprout-el";
      el.innerHTML = makeSproutSVG(parseInt(sp.id.replace("s", "")) * 17 + 3);
      canvas.appendChild(el);

      const idx = clusterCounts[sp.freeCluster]++;
      sproutEls.push({ el, sp, freeIdx: idx });
    });

    // Calculer totaux par cluster pour scatter
    const clusterTotals = {};
    DATA.sprouts.forEach((sp) => {
      clusterTotals[sp.freeCluster] = (clusterTotals[sp.freeCluster] || 0) + 1;
    });

    // ── Positionner une pousse ─────────────────────────────────────────────────
    function setSproutPos(el, rx, ry) {
      const w = el.offsetWidth  || 40;
      const h = el.offsetHeight || 60;
      gsap.set(el, {
        x: rx * W() - w / 2,
        y: ry * H() - h,
      });
    }

    function layoutFree() {
      const totals = {};
      DATA.sprouts.forEach((sp) => {
        totals[sp.freeCluster] = (totals[sp.freeCluster] || 0) + 1;
      });
      const idxMap = { care: 0, action: 0, logic: 0 };

      sproutEls.forEach(({ el, sp }) => {
        const idx = idxMap[sp.freeCluster]++;
        const pos = clusterPos(sp.freeCluster, idx, totals[sp.freeCluster]);
        setSproutPos(el, pos.rx, pos.ry);
      });
    }

    // ── Initialisation (scène 0) ──────────────────────────────────────────────
    function initScene() {
      positionClusterLabels();
      positionStatBadges();
      layoutFree();

      sproutEls.forEach(({ el }) => {
        gsap.set(el, { color: "#4caf50", opacity: 1, filter: "none" });
        el.querySelector("svg").style.filter = "none";
      });

      Object.values(clusterLabelEls).forEach((el) => (el.style.opacity = "1"));
      Object.values(statBadges).forEach((el) => (el.style.opacity = "0"));

      setTimeout(() => textOverlay.classList.add("visible"), 300);
    }

    // ── ScrollTrigger animations ───────────────────────────────────────────────

    // Helper : est-ce que la pousse est "mal placée" (imposé hors de son cluster libre) ?
    function isMismatched(sp) {
      const toy = DATA.toys.find((t) => t.id === sp.freedToy);
      return toy && toy.cluster !== sp.freeCluster;
    }

    // ── TRANSITION 1 : libre → genré (scroll 1→2) ────────────────────────────
    ScrollTrigger.create({
      trigger: sticky,
      start: "top top",
      end: () => `+=${scrollHeight * 0.3}`,
      scrub: 1.2,
      onUpdate(self) {
        const p = self.progress;

        sproutEls.forEach(({ el, sp, freeIdx }) => {
          const freeTotals = clusterTotals[sp.freeCluster] || 10;
          const freeP = clusterPos(sp.freeCluster, freeIdx, freeTotals);
          const toyP  = toyPos(sp.freedToy);

          // Interpolation position
          const rx = freeP.rx + (toyP.rx - freeP.rx) * p;
          const ry = freeP.ry + (toyP.ry - freeP.ry) * p;
          setSproutPos(el, rx, ry);

          // Couleur → gris si déplacé hors cluster
          if (isMismatched(sp)) {
            const gray = Math.round(180 - p * 100); // 180→80
            const green = Math.round(175 - p * 175);
            el.style.color = `rgb(${gray}, ${gray + (green > 0 ? green/3 : 0)}, ${gray - p*40 > 0 ? gray - p*40 : 0})`;
            gsap.set(el, { opacity: 1 - p * 0.35 });
          }
        });

        // Labels cluster s'estompent
        Object.values(clusterLabelEls).forEach((el) => {
          el.style.opacity = String(1 - p * 0.6);
        });
      },
      onEnter() {
        updateText(
          "Le jouet leur est imposé",
          "Dès 2 ans, les jouets sont genrés. Les enfants sont redirigés — certains quittent le cluster qui leur plaisait."
        );
      },
      onLeaveBack() {
        updateText(
          "Un jardin libre",
          "50 enfants. Chacun gravite librement autour des centres d'intérêt qui l'attirent. On ne sait pas qui est qui."
        );
        layoutFree();
        sproutEls.forEach(({ el }) => {
          gsap.set(el, { color: "#4caf50", opacity: 1 });
        });
        Object.values(clusterLabelEls).forEach((el) => (el.style.opacity = "1"));
      },
    });

    // ── TRANSITION 2 : focus poupée + voitures (scroll 2→3) ─────────────────
    ScrollTrigger.create({
      trigger: sticky,
      start: () => `+=${scrollHeight * 0.3}`,
      end:   () => `+=${scrollHeight * 0.6}`,
      scrub: 1.2,
      onUpdate(self) {
        const p = self.progress;
        const HIGHLIGHTED = ["poupee", "petites_voitures"];

        sproutEls.forEach(({ el, sp }) => {
          const isHL = HIGHLIGHTED.includes(sp.freedToy);
          if (!isHL) {
            gsap.set(el, { opacity: 1 - p * 0.85 });
          } else {
            // Légère mise en avant : scale + retour au vert si bien placé
            const matched = !isMismatched(sp);
            if (matched) {
              el.style.color = `rgb(${Math.round(76 + p*20)}, ${Math.round(175 - p*30)}, ${Math.round(80)})`;
            }
            gsap.set(el, { opacity: 1, scale: 1 + p * 0.15 });
          }
        });

        // Labels cluster disparaissent
        Object.values(clusterLabelEls).forEach((el) => {
          el.style.opacity = String(Math.max(0, 0.4 - p * 0.4));
        });

        // Badges stats apparaissent
        Object.values(statBadges).forEach((el) => {
          el.style.opacity = String(p);
        });
      },
      onEnter() {
        updateText(
          "L'écart le plus fort",
          "Poupée : 81% filles, 19% garçons. Petites voitures : 89% garçons, 32% filles.\nCe ne sont pas des goûts — ce sont des assignations."
        );
      },
      onLeaveBack() {
        updateText(
          "Le jouet leur est imposé",
          "Dès 2 ans, les jouets sont genrés. Les enfants sont redirigés — certains quittent le cluster qui leur plaisait."
        );
        sproutEls.forEach(({ el }) => {
          gsap.set(el, { opacity: 1, scale: 1 });
        });
        Object.values(statBadges).forEach((el) => (el.style.opacity = "0"));
      },
    });

    // ── Helpers ────────────────────────────────────────────────────────────────
    function updateText(label, desc) {
      document.getElementById("tsl").textContent = label;
      document.getElementById("tsd").textContent = desc;
    }

    // ── Resize ─────────────────────────────────────────────────────────────────
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        positionClusterLabels();
        positionStatBadges();
        layoutFree();
        ScrollTrigger.refresh();
      }, 120);
    });

    // ── GO ─────────────────────────────────────────────────────────────────────
    // Attendre que les éléments soient dans le DOM
    requestAnimationFrame(() => requestAnimationFrame(initScene));
  }

  // ─── PRNG déterministe (Mulberry32) ───────────────────────────────────────
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6d2b79f5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // ─── Lancement ────────────────────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
/**
 * src/section/workplace.js
 * Vite + ES module — import initWorkplace from './section/workplace.js'
 * Cible : <div id="leTravail">
 *
 * FLEUR UNIQUE — chaque pétale = une inégalité
 * Partie opaque = part des femmes
 * Partie transparente = part des hommes
 * Rayon total = poids/importance du domaine
 */

export default function initWorkplace() {

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

  // ── Données — tous les pétales ─────────────────────────────────────────────
  // womenPct   : part visible opaque (femmes)
  // radius     : rayon total du pétale (importance)
  // color      : teinte du pétale
  const PETALS = [
    // ── Secteurs professionnels ──
    {
      id: "sante",
      label: "Santé &\naction sociale",
      category: "secteur",
      womenPct: 76,
      radius: 360,
      color: "#8b5e3c",
      note: "76% de femmes — secteur le plus féminisé",
    },
    {
      id: "enseignement",
      label: "Enseignement",
      category: "secteur",
      womenPct: 60,
      radius: 300,
      color: "#a07040",
      note: "60% de femmes",
    },
    {
      id: "info_com",
      label: "Information &\ncommunication",
      category: "secteur",
      womenPct: 28,
      radius: 252,
      color: "#7a6050",
      note: "28% de femmes — forte dominance masculine",
    },
    {
      id: "transports",
      label: "Transports &\nentreposage",
      category: "secteur",
      womenPct: 22,
      radius: 230,
      color: "#6a5545",
      note: "22% de femmes",
    },
    {
      id: "construction",
      label: "Construction",
      category: "secteur",
      womenPct: 10,
      radius: 258,
      color: "#5a4a3a",
      note: "10% de femmes — secteur le plus masculinisé",
      falling: true,
    },
    // ── Inégalités structurelles ──
    {
      id: "direction",
      label: "Postes de\ndirection",
      category: "inegalite",
      womenPct: 38.6,
      radius: 270,
      color: "#9a7060",
      note: "38,6% des postes dirigeants occupés par des femmes en 2025",
    },
    {
      id: "temps_partiel",
      label: "Temps\npartiel",
      category: "inegalite",
      womenPct: 59,
      radius: 288,
      color: "#b08060",
      note: "59% des femmes actives travaillent à temps partiel, contre 20% des hommes",
    },
    {
      id: "reduction_enfants",
      label: "Réduction\npour enfants",
      category: "inegalite",
      womenPct: 60,
      radius: 262,
      color: "#c09070",
      note: "60% des femmes ont réduit leur taux pour s'occuper d'enfants, contre 13% des hommes",
    },
    {
      id: "revenu_menage",
      label: "Contribution\nau revenu",
      category: "inegalite",
      womenPct: 28,
      radius: 248,
      color: "#7a6858",
      note: "Les femmes contribuent à 28% du revenu du ménage dès l'arrivée d'un enfant",
    },
  ];

  const N = PETALS.length;
  const ANGLE_STEP = (2 * Math.PI) / N;
  const GAP = 0.06; // espace entre pétales

  // ── Build ──────────────────────────────────────────────────────────────────
  function build() {
    const container = document.getElementById("leTravail");
    if (!container) return console.warn("#leTravail introuvable");

    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600&family=Fleur+De+Leah&display=swap');

      #leTravail {
        position: relative;
        width: 100%;
        height: 700vh;
        background: #f2ece0;
        font-family: 'Quicksand', sans-serif;
      }
      .wk-sticky {
        position: sticky;
        top: 0; width: 100%; height: 100vh;
        overflow: hidden;
      }

      /* ── Panneau texte gauche ── */
      .wk-text {
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
      .wk-text::after {
        content: '';
        position: absolute; top:0; right:-60px;
        width:60px; height:100%;
        background: linear-gradient(to right, #f2ece0, transparent);
        pointer-events: none;
      }
      .wk-eyebrow {
        font-size: 0.6rem; letter-spacing:0.22em;
        text-transform: uppercase; color:#9a8060;
        margin-bottom:1rem;
        opacity:0; transform:translateY(8px);
        transition: opacity 0.45s, transform 0.45s;
      }
      .wk-headline {
        font-family: 'Fleur De Leah', cursive;
        font-size: clamp(2rem, 3.5vw, 3rem);
        font-weight: 400; color:#1a1208;
        line-height:1.2; margin-bottom:1.4rem;
        opacity:0; transform:translateY(10px);
        transition: opacity 0.45s 0.07s, transform 0.45s 0.07s;
      }
      .wk-body {
        font-size: clamp(0.82rem, 1.1vw, 0.92rem);
        color:#3a3020; line-height:1.8;
        opacity:0; transform:translateY(8px);
        transition: opacity 0.45s 0.14s, transform 0.45s 0.14s;
      }
      .wk-body em    { font-style:italic; color:#5a4830; }
      .wk-body strong{ font-weight:600; color:#1a1208; }
      .wk-note {
        margin-top:1.4rem; font-size:0.78rem;
        color:#7a6848; line-height:1.7; font-style:italic;
        border-left:3px solid #c4a060; padding-left:1rem;
        opacity:0; transform:translateY(6px);
        transition: opacity 0.45s 0.21s, transform 0.45s 0.21s;
      }
      .wk-text.visible .wk-eyebrow,
      .wk-text.visible .wk-headline,
      .wk-text.visible .wk-body,
      .wk-text.visible .wk-note { opacity:1; transform:translateY(0); }

      /* ── Zone droite ── */
      .wk-viz {
        position: absolute;
        top:0; left:40%;
        width:60%; height:100%;
        overflow: visible;
        z-index: 1;
      }

      /* ── Fleur ── */
      .wk-flower-wrap {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -45%);
        z-index: 5;
      }

      /* ── Labels pétales ── */
      .wk-petal-label {
        position: absolute;
        font-size: clamp(0.78rem, 1.1vw, 1rem);
        color: #4a3820;
        pointer-events: none;
        text-align: center;
        line-height: 1.45;
        z-index: 6;
        white-space: pre-line;
        opacity: 0;
        transition: opacity 0.5s;
        font-family: 'Quicksand', sans-serif;
        font-weight: 500;
      }

      /* ── Info pétale actif ── */
      .wk-petal-info {
        position: absolute;
        bottom: 2rem; left: 50%;
        transform: translateX(-50%);
        text-align: center;
        z-index: 20;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
        font-family: 'Quicksand', sans-serif;
      }
      .wk-petal-info.visible { opacity: 1; }
      .wk-petal-info-pct {
        font-size: clamp(2.2rem, 4vw, 3.2rem);
        font-weight: 600; color: #1a1208; line-height:1;
      }
      .wk-petal-info-note {
        font-size: 0.72rem; color: #6a5840;
        margin-top: 4px; font-style: italic;
        max-width: 280px;
      }

      /* ── Légende ── */
      .wk-legend {
        position: absolute;
        top: 2rem; right: 1.5rem;
        display: flex; flex-direction: column; gap: 8px;
        z-index: 10; pointer-events: none;
        opacity: 0; transition: opacity 0.6s;
        font-family: 'Quicksand', sans-serif;
      }
      .wk-legend.visible { opacity: 1; }
      .wk-legend-row {
        display: flex; align-items: center; gap: 8px;
        font-size: 0.62rem; color: #6a5840;
        letter-spacing: 0.04em;
      }
      .wk-legend-swatch {
        width: 28px; height: 10px;
        border-radius: 2px; flex-shrink:0;
      }

      /* Source */
      .wk-source {
        position: absolute; bottom: 1rem; right: 1.5rem;
        font-size: 0.56rem; color: #b0a080; font-style: italic;
        z-index: 200; pointer-events: none;
        font-family: 'Quicksand', sans-serif;
      }

      /* Séparateur catégories */
      .wk-cat-label {
        position: absolute;
        font-size: 0.58rem; letter-spacing: 0.14em;
        text-transform: uppercase; color: #9a8060;
        pointer-events: none; z-index: 7;
        opacity: 0; transition: opacity 0.5s;
        font-family: 'Quicksand', sans-serif;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);

    // ── DOM ──────────────────────────────────────────────────────────────────
    const sticky = document.createElement("div");
    sticky.className = "wk-sticky";
    container.appendChild(sticky);

    const textPanel = document.createElement("div");
    textPanel.className = "wk-text";
    textPanel.innerHTML = `
      <div class="wk-eyebrow"  id="wk-ey">Le monde professionnel</div>
      <div class="wk-headline" id="wk-hl">Une fleur, toutes les inégalités.</div>
      <div class="wk-body"     id="wk-bd">Chaque pétale représente un domaine ou une réalité.<br><br>
        La partie <em>opaque</em> = la part des femmes.<br>
        La partie <em>transparente</em> = la part des hommes.<br>
        Le rayon = le poids du secteur.</div>
      <div class="wk-note"     id="wk-nt">Survolez un pétale pour voir le détail.</div>
    `;
    sticky.appendChild(textPanel);

    const viz = document.createElement("div");
    viz.className = "wk-viz";
    sticky.appendChild(viz);

    const srcEl = document.createElement("div");
    srcEl.className = "wk-source";
    srcEl.textContent = "OFS – ESPA 2025 / Observatoire des inégalités";
    sticky.appendChild(srcEl);

    // Légende
    const legend = document.createElement("div");
    legend.className = "wk-legend";
    legend.innerHTML = `
      <div class="wk-legend-row">
        <div class="wk-legend-swatch" style="background:#8b5e3c;opacity:0.85"></div>
        Part des femmes
      </div>
      <div class="wk-legend-row">
        <div class="wk-legend-swatch" style="background:#8b5e3c;opacity:0.18;border:1px solid #9a8060"></div>
        Part des hommes
      </div>
    `;
    viz.appendChild(legend);

    // Info pétale
    const petalInfo = document.createElement("div");
    petalInfo.className = "wk-petal-info";
    petalInfo.innerHTML = `
      <div class="wk-petal-info-pct" id="wk-info-pct"></div>
      <div class="wk-petal-info-note" id="wk-info-note"></div>
    `;
    viz.appendChild(petalInfo);

    // ── SVG fleur ─────────────────────────────────────────────────────────────
    const SVG_W = 1100, SVG_H = 1100;
    const CX = SVG_W / 2, CY = SVG_H / 2;
    const svgNS = "http://www.w3.org/2000/svg";
    const MIN_R = 42; // rayon intérieur fixe (trou central)

    const flowerWrap = document.createElement("div");
    flowerWrap.className = "wk-flower-wrap";
    viz.appendChild(flowerWrap);

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width",   String(SVG_W));
    svg.setAttribute("height",  String(SVG_H));
    svg.setAttribute("viewBox", `0 0 ${SVG_W} ${SVG_H}`);
    svg.style.overflow = "visible";
    flowerWrap.appendChild(svg);

    // ── Helpers géométrie ─────────────────────────────────────────────────────
    function pt(cx, cy, r, angle) {
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    }

    // Arc SVG : anneau entre rInner et rOuter, de startA à endA
    function arcPath(cx, cy, rInner, rOuter, startA, endA) {
      const s1 = pt(cx, cy, rInner, startA);
      const e1 = pt(cx, cy, rInner, endA);
      const s2 = pt(cx, cy, rOuter, endA);
      const e2 = pt(cx, cy, rOuter, startA);
      const lg = endA - startA > Math.PI ? 1 : 0;
      return [
        `M ${f(s1.x)} ${f(s1.y)}`,
        `A ${f(rInner)} ${f(rInner)} 0 ${lg} 1 ${f(e1.x)} ${f(e1.y)}`,
        `L ${f(s2.x)} ${f(s2.y)}`,
        `A ${f(rOuter)} ${f(rOuter)} 0 ${lg} 0 ${f(e2.x)} ${f(e2.y)}`,
        "Z",
      ].join(" ");
    }

    function f(n) { return n.toFixed(2); }

    // ── Créer les pétales ─────────────────────────────────────────────────────
    const petalEls    = [];
    const labelEls    = [];
    const catLabelEls = {};

    // Séparateurs de catégories (arc texte entre secteurs et inégalités)
    // On place les secteurs en premier (index 0–4), inégalités ensuite (5–8)
    const sectorCount    = PETALS.filter(p => p.category === "secteur").length;
    const inegaliteCount = PETALS.filter(p => p.category === "inegalite").length;

    PETALS.forEach((p, i) => {
      const startA = i * ANGLE_STEP - Math.PI / 2 + GAP / 2;
      const endA   = startA + ANGLE_STEP - GAP;
      const midA   = (startA + endA) / 2;

      const rFull    = p.radius;                        // rayon total
      const rWomen   = MIN_R + (rFull - MIN_R) * (p.womenPct / 100); // rayon femmes

      // ── Groupe pétale ──
      const g = document.createElementNS(svgNS, "g");
      g.style.cursor = "pointer";
      g.style.opacity = "0";
      g.style.transformOrigin = `${CX}px ${CY}px`;

      // Fond hommes (partie transparente — rayon complet)
      const pathMen = document.createElementNS(svgNS, "path");
      pathMen.setAttribute("d", arcPath(CX, CY, MIN_R, rFull, startA, endA));
      pathMen.setAttribute("fill", p.color);
      pathMen.setAttribute("opacity", "0.15");
      pathMen.setAttribute("stroke", p.color);
      pathMen.setAttribute("stroke-width", "0.5");
      g.appendChild(pathMen);

      // Part femmes (opaque)
      const pathWomen = document.createElementNS(svgNS, "path");
      pathWomen.setAttribute("d", arcPath(CX, CY, MIN_R, rWomen, startA, endA));
      pathWomen.setAttribute("fill", p.color);
      pathWomen.setAttribute("opacity", "0.85");
      g.appendChild(pathWomen);

      // Contour pétale
      const pathBorder = document.createElementNS(svgNS, "path");
      pathBorder.setAttribute("d", arcPath(CX, CY, MIN_R, rFull, startA, endA));
      pathBorder.setAttribute("fill", "none");
      pathBorder.setAttribute("stroke", p.color);
      pathBorder.setAttribute("stroke-width", "1");
      pathBorder.setAttribute("opacity", "0.4");
      g.appendChild(pathBorder);

      // Ligne séparatrice femmes/hommes (tiret)
      const midWomenPt1 = pt(CX, CY, MIN_R + 2, midA);
      const midWomenPt2 = pt(CX, CY, rWomen,    midA);
      // Petite marque à la jonction
      const sepArcStart = midA - 0.04;
      const sepArcEnd   = midA + 0.04;
      const sepPath = document.createElementNS(svgNS, "path");
      sepPath.setAttribute("d", arcPath(CX, CY, rWomen - 1, rWomen + 1, startA + 0.01, endA - 0.01));
      sepPath.setAttribute("fill", p.color);
      sepPath.setAttribute("opacity", "0.5");
      g.appendChild(sepPath);

      // % femmes au milieu de la partie opaque
      const labelR = MIN_R + (rWomen - MIN_R) * 0.55;
      const labelPt = pt(CX, CY, labelR, midA);
      const txt = document.createElementNS(svgNS, "text");
      txt.setAttribute("x", f(labelPt.x));
      txt.setAttribute("y", f(labelPt.y));
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("dominant-baseline", "middle");
      txt.setAttribute("font-size", rWomen > 130 ? "16" : "13");
      txt.setAttribute("font-family", "Quicksand, sans-serif");
      txt.setAttribute("font-weight", "600");
      txt.setAttribute("fill", "#f2ece0");
      txt.setAttribute("opacity", "0.9");
      txt.textContent = `${p.womenPct}%`;
      g.appendChild(txt);

      // Hover — décalage radial + transparence des autres
      g.addEventListener("mouseenter", () => {
        // Ce pétale : léger décalage vers l'extérieur
        const dx = Math.cos(midA) * 30;
        const dy = Math.sin(midA) * 30;
        g.dataset.hovered = "1";
        g.style.transition = "transform 0.25s ease, opacity 0.25s ease";
        g.style.transform  = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;

        // Les autres pétales : légèrement estompés
        petalEls.forEach(other => {
          if (other.g !== g) {
            other.g.style.transition = "opacity 0.25s ease";
            other.g.style.opacity = "0.3";
          }
        });

        // Info
        document.getElementById("wk-info-pct").textContent  = `${p.womenPct}% de femmes`;
        document.getElementById("wk-info-note").textContent = p.note;
        petalInfo.classList.add("visible");
      });
      g.addEventListener("mouseleave", () => {
        delete g.dataset.hovered;
        g.style.transition = "transform 0.25s ease, opacity 0.25s ease";
        g.style.transform  = "";

        petalEls.forEach(other => {
          other.g.style.transition = "opacity 0.25s ease";
          other.g.style.opacity = other.g.dataset.baseOpacity || "1";
        });

        petalInfo.classList.remove("visible");
      });

      svg.appendChild(g);
      g.dataset.baseOpacity = "1";
      petalEls.push({ g, p, startA, endA, midA, rFull, rWomen });

      // Label extérieur
      const labelRext = rFull + 42;
      const lp = pt(CX, CY, labelRext, midA);
      const labelDiv = document.createElement("div");
      labelDiv.className = "wk-petal-label";
      labelDiv.textContent = p.label;
      viz.appendChild(labelDiv);
      labelEls.push({ el: labelDiv, svgPt: lp, midA });
    });

    // Tige (comme toys.js) — descend depuis le centre vers le bas
    const stem = document.createElementNS(svgNS, "path");
    stem.setAttribute("d", `M${CX} ${CY + MIN_R} C${CX - 20} ${CY + MIN_R + 120}, ${CX + 28} ${CY + MIN_R + 280}, ${CX - 5} ${CY + MIN_R + 420}`);
    stem.setAttribute("stroke", "#5a7a35");
    stem.setAttribute("stroke-width", "4.5");
    stem.setAttribute("stroke-linecap", "round");
    stem.setAttribute("fill", "none");
    svg.appendChild(stem);

    // Feuille sur la tige
    const leaf = document.createElementNS(svgNS, "path");
    leaf.setAttribute("d", `M${CX} ${CY + MIN_R + 220} Q${CX + 65} ${CY + MIN_R + 185} ${CX + 55} ${CY + MIN_R + 248}`);
    leaf.setAttribute("stroke", "#5a7a35");
    leaf.setAttribute("stroke-width", "2.5");
    leaf.setAttribute("stroke-linecap", "round");
    leaf.setAttribute("fill", "none");
    leaf.setAttribute("opacity", "0.7");
    svg.appendChild(leaf);

    // Cercle central
    const centerCircle = document.createElementNS(svgNS, "circle");
    centerCircle.setAttribute("cx", String(CX));
    centerCircle.setAttribute("cy", String(CY));
    centerCircle.setAttribute("r",  String(MIN_R));
    centerCircle.setAttribute("fill", "#f2ece0");
    centerCircle.setAttribute("stroke", "#c4a060");
    centerCircle.setAttribute("stroke-width", "1");
    svg.appendChild(centerCircle);

    // Petit point central
    const centerDot = document.createElementNS(svgNS, "circle");
    centerDot.setAttribute("cx", String(CX));
    centerDot.setAttribute("cy", String(CY));
    centerDot.setAttribute("r",  "4");
    centerDot.setAttribute("fill", "#5a7a35");
    svg.appendChild(centerDot);

    // ── Positionner les labels ────────────────────────────────────────────────
    function positionLabels() {
      const wRect = flowerWrap.getBoundingClientRect();
      const vRect = viz.getBoundingClientRect();
      const ox = wRect.left - vRect.left;
      const oy = wRect.top  - vRect.top;

      labelEls.forEach(({ el, svgPt, midA }) => {
        // Décalage pour que le label ne chevauche pas
        const extraR  = 12;
        const scaledX = ox + svgPt.x;
        const scaledY = oy + svgPt.y;
        el.style.left      = scaledX + "px";
        el.style.top       = scaledY + "px";
        el.style.transform = "translate(-50%, -50%)";
      });
    }

    // ── Narration ─────────────────────────────────────────────────────────────
    const scenes = [
      {
        ey: "Le monde professionnel",
        hl: "Une fleur, toutes les inégalités.",
        bd: `Chaque pétale représente un domaine ou une réalité.<br><br>
             La partie <em>opaque</em> = la part des femmes.<br>
             La partie <em>transparente</em> = la part des hommes.<br>
             Le rayon = le poids du secteur.`,
        nt: "Survolez un pétale pour voir le détail.",
      },
      {
        ey: "Les secteurs professionnels",
        hl: "De 76% à 10%.",
        bd: `La santé emploie <strong>76% de femmes</strong>.<br>
             La construction, seulement <strong>10%</strong>.<br><br>
             Un écart de 66 points entre les deux extrêmes —<br>
             dans le même marché du travail.`,
        nt: "Ces déséquilibres ne sont pas naturels. Ils sont construits.",
      },
      {
        ey: "Les inégalités structurelles",
        hl: "Même en travaillant, les écarts persistent.",
        bd: `<strong>38,6%</strong> des postes de direction seulement<br>
             sont occupés par des femmes.<br><br>
             <strong>59%</strong> des femmes actives travaillent à temps partiel,<br>
             contre <strong>20%</strong> des hommes.`,
        nt: "Dès l'arrivée d'un enfant, la contribution des femmes au revenu du ménage chute à 28%.",
      },
    ];

    function setScene(idx) {
      const s = scenes[idx];
      textPanel.classList.remove("visible");
      setTimeout(() => {
        document.getElementById("wk-ey").textContent = s.ey;
        document.getElementById("wk-hl").textContent = s.hl;
        document.getElementById("wk-bd").innerHTML   = s.bd;
        document.getElementById("wk-nt").innerHTML   = s.nt;
        textPanel.classList.add("visible");
      }, 200);
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    function initScene() {
      positionLabels();
      petalEls.forEach(({ g }) => { g.style.opacity = "0"; });
      labelEls.forEach(({ el }) => { el.style.opacity = "0"; });
      legend.classList.remove("visible");
    }

    // ── ScrollTrigger 1 : fleur apparaît (0%→30%) ─────────────────────────────
    // Les secteurs s'ouvrent en éventail
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "30% top",
      scrub: 2,
      onEnter()     { setScene(0); },
      onLeaveBack() { initScene(); },
      onUpdate(self) {
        const p = self.progress;
        legend.style.opacity = String(Math.min(1, p * 3));
        legend.classList.toggle("visible", p > 0.1);

        // Tous les pétales apparaissent progressivement
        petalEls.forEach(({ g }, i) => {
          const thresh = (i / N) * 0.7;
          const lp = Math.max(0, Math.min(1, (p - thresh) / 0.3));
          g.style.opacity = String(lp);
          g.dataset.baseOpacity = String(lp);
          // Scale d'entrée — uniquement si pas en hover (pas de translate actif)
          if (!g.dataset.hovered) {
            const sc = 0.3 + lp * 0.7;
            g.style.transform = `scale(${sc})`;
            g.style.transformOrigin = `${CX}px ${CY}px`;
          }
        });
        labelEls.forEach(({ el }, i) => {
          const thresh = (i / N) * 0.7 + 0.1;
          const lp = Math.max(0, Math.min(1, (p - thresh) / 0.3));
          el.style.opacity = String(lp);
        });
      },
    });

    // ── ScrollTrigger 2 : focus secteurs (30%→55%) ───────────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: "30% top",
      end: "55% top",
      scrub: 2,
      onEnter()     { setScene(1); },
      onLeaveBack() { setScene(0); },
      onUpdate(self) {
        const p = self.progress;
        petalEls.forEach(({ g }, i) => {
          const isIneg = PETALS[i].category === "inegalite";
          const op = isIneg ? String(1 - p * 0.55) : "1";
          g.style.opacity = op;
          g.dataset.baseOpacity = op;
        });
      },
    });

    // ── ScrollTrigger 3 : focus inégalités (55%→80%) ─────────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: "55% top",
      end: "80% top",
      scrub: 2,
      onEnter()     { setScene(2); },
      onLeaveBack() { setScene(1); },
      onUpdate(self) {
        const p = self.progress;
        petalEls.forEach(({ g }, i) => {
          const isIneg = PETALS[i].category === "inegalite";
          const op = isIneg ? String(0.45 + p * 0.55) : String(1 - p * 0.55);
          g.style.opacity = op;
          g.dataset.baseOpacity = op;
        });
      },
    });

    // ── Resize ────────────────────────────────────────────────────────────────
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => { positionLabels(); ScrollTrigger.refresh(); }, 150);
    });

    requestAnimationFrame(() => requestAnimationFrame(() => {
      initScene();
      setScene(0);
      setTimeout(() => textPanel.classList.add("visible"), 350);
    }));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
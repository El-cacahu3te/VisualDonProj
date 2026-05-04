/**
 * src/section/workplace.js — Scrollytelling "La répartition des genres dans le monde professionnel"
 * Vite + ES module — importé depuis src/main.js via : import initWorkplace from './section/workplace.js'
 * GSAP + ScrollTrigger injectés automatiquement depuis le CDN
 * Cible : <div id="leTravail">
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

  // ── Données ────────────────────────────────────────────────────────────────
  const DATA = {
    source: "OFS – Enquête suisse sur la population active (ESPA), état 17.02.2026",
    sectors: [
      { id:"sante",        label:"Santé et\naction sociale",          womenPct:76, menPct:24, shareOfWorkforce:15.2, dominance:"female" },
      { id:"enseignement", label:"Enseignement",                       womenPct:60, menPct:40, shareOfWorkforce:9.8,  dominance:"female" },
      { id:"info_com",     label:"Information et\ncommunication",      womenPct:28, menPct:72, shareOfWorkforce:5.4,  dominance:"male"   },
      { id:"transports",   label:"Transports et\nentreposage",         womenPct:22, menPct:78, shareOfWorkforce:4.8,  dominance:"male"   },
      { id:"construction", label:"Construction",                       womenPct:10, menPct:90, shareOfWorkforce:6.1,  dominance:"male", falling:true },
    ],
    leadership: [
      { label:"Membre de la direction\nou cheffe",    womenPct:38.6 },
      { label:"Membre de la direction",               womenPct:37.7 },
      { label:"Exerçant une\nfonction de cheffe",     womenPct:34.8 },
    ],
    keyFigures: [
      { label:"travaillent à temps partiel",          women:59, men:20,  note:"Les femmes sont 3× plus souvent à temps partiel" },
      { label:"ont réduit leur temps pour\ns'occuper d'enfants",  women:60, men:13,  note:"Écart de 47 points — la charge parentale repose sur les femmes" },
      { label:"contribution au revenu\ndu ménage (enfant 0–3 ans)", women:28, men:72, note:"Dès l'arrivée d'un enfant, la contribution économique des femmes s'effondre" },
    ],
  };

  // ── Build ──────────────────────────────────────────────────────────────────
  function build() {
    const container = document.getElementById("leTravail");
    if (!container) return console.warn("#leTravail introuvable");

    // ── CSS ──────────────────────────────────────────────────────────────────
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

      #leTravail {
        position: relative;
        width: 100%;
        height: 800vh;
        background: #f2ece0;
        font-family: 'Lora', Georgia, serif;
      }
      .wk-sticky {
        position: sticky;
        top: 0; width: 100%; height: 100vh;
        overflow: hidden;
      }

      /* ── Panneau texte gauche — identique à toys ── */
      .wk-text {
        position: absolute;
        top: 0; left: 0;
        width: 40%; height: 100%;
        background: #f2ece0;
        z-index: 100;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 3rem 2rem 3rem 4rem;
        box-sizing: border-box;
      }
      .wk-text::after {
        content: '';
        position: absolute;
        top: 0; right: -60px;
        width: 60px; height: 100%;
        background: linear-gradient(to right, #f2ece0, transparent);
        pointer-events: none;
      }
      .wk-eyebrow {
        font-size: 0.62rem;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: #9a8060;
        margin-bottom: 1rem;
        opacity: 0; transform: translateY(8px);
        transition: opacity 0.45s, transform 0.45s;
      }
      .wk-headline {
        font-size: clamp(1.4rem, 2.5vw, 2.2rem);
        font-weight: 600; color: #1a1208;
        line-height: 1.2; margin-bottom: 1.4rem;
        opacity: 0; transform: translateY(10px);
        transition: opacity 0.45s 0.07s, transform 0.45s 0.07s;
      }
      .wk-body {
        font-size: clamp(0.82rem, 1.1vw, 0.95rem);
        color: #3a3020; line-height: 1.8;
        opacity: 0; transform: translateY(8px);
        transition: opacity 0.45s 0.14s, transform 0.45s 0.14s;
      }
      .wk-body em    { font-style:italic; color:#5a4830; }
      .wk-body strong{ font-weight:600; color:#1a1208; }
      .wk-note {
        margin-top: 1.4rem;
        font-size: 0.78rem; color: #7a6848;
        line-height: 1.7; font-style: italic;
        border-left: 3px solid #c4a060;
        padding-left: 1rem;
        opacity: 0; transform: translateY(6px);
        transition: opacity 0.45s 0.21s, transform 0.45s 0.21s;
      }
      .wk-text.visible .wk-eyebrow,
      .wk-text.visible .wk-headline,
      .wk-text.visible .wk-body,
      .wk-text.visible .wk-note { opacity:1; transform:translateY(0); }

      /* ── Zone droite — visualisation ── */
      .wk-viz {
        position: absolute;
        top: 0; left: 40%;
        width: 60%; height: 100%;
        overflow: hidden;
        z-index: 1;
      }

      /* ── Fleur SVG centrale ── */
      .wk-flower-wrap {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        z-index: 5;
      }

      /* ── Pétale tombant (scène 3) ── */
      .wk-falling-petal {
        position: absolute;
        top: 50%; left: 50%;
        transform-origin: top center;
        z-index: 4;
        pointer-events: none;
        opacity: 0;
      }

      /* ── Labels secteurs ── */
      .wk-sector-label {
        position: absolute;
        font-size: clamp(0.58rem, 0.85vw, 0.72rem);
        color: #4a3820;
        pointer-events: none;
        text-align: center;
        line-height: 1.4;
        z-index: 6;
        opacity: 0;
        transition: opacity 0.6s;
        white-space: pre-line;
      }

      /* ── Légende ── */
      .wk-legend {
        position: absolute;
        bottom: 2rem; right: 2rem;
        display: flex; flex-direction: column; gap: 6px;
        z-index: 10; pointer-events: none;
        opacity: 0; transition: opacity 0.5s;
      }
      .wk-legend-row {
        display: flex; align-items: center; gap: 8px;
        font-size: 0.62rem; color: #6a5840;
        letter-spacing: 0.06em;
      }
      .wk-legend-dot {
        width: 10px; height: 10px; border-radius: 50%;
        flex-shrink: 0;
      }

      /* ── Stats leadership ── */
      .wk-leadership {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        display: flex; flex-direction: column;
        gap: 1.4rem; z-index: 10;
        opacity: 0; pointer-events: none;
        transition: opacity 0.6s;
        width: 80%;
      }
      .wk-lead-row {
        display: flex; flex-direction: column; gap: 6px;
      }
      .wk-lead-label {
        font-size: 0.7rem; color: #6a5840;
        letter-spacing: 0.08em; white-space: pre-line;
      }
      .wk-lead-bar-wrap {
        position: relative; height: 28px;
        background: rgba(180,160,120,0.18);
        border-radius: 2px; overflow: hidden;
      }
      .wk-lead-bar-women {
        position: absolute; top:0; left:0; height:100%;
        background: #8b5e3c;
        border-radius: 2px 0 0 2px;
        transition: width 0.8s cubic-bezier(.4,0,.2,1);
      }
      .wk-lead-bar-men {
        position: absolute; top:0; right:0; height:100%;
        background: rgba(180,160,120,0.35);
        border-radius: 0 2px 2px 0;
      }
      .wk-lead-pct {
        position: absolute; top:50%; left:8px;
        transform: translateY(-50%);
        font-size: 0.78rem; font-weight:600;
        color: #f2ece0;
      }

      /* ── Chiffres clés ── */
      .wk-keyfigs {
        position: absolute;
        top: 10%; left: 5%; right: 5%;
        display: flex; flex-direction: column; gap: 1.6rem;
        z-index: 10; opacity: 0; pointer-events: none;
        transition: opacity 0.6s;
      }
      .wk-kf-row { display: flex; flex-direction: column; gap: 8px; }
      .wk-kf-label {
        font-size: 0.68rem; color: #6a5840;
        letter-spacing: 0.06em; white-space: pre-line;
        text-transform: uppercase;
      }
      .wk-kf-bars {
        display: flex; flex-direction: column; gap: 4px;
      }
      .wk-kf-bar-row {
        display: flex; align-items: center; gap: 10px;
      }
      .wk-kf-bar-track {
        flex: 1; height: 22px;
        background: rgba(180,160,120,0.15);
        border-radius: 2px; position: relative; overflow: hidden;
      }
      .wk-kf-bar-fill {
        position: absolute; top:0; left:0; height:100%;
        border-radius: 2px;
        transition: width 0.9s cubic-bezier(.4,0,.2,1);
      }
      .wk-kf-bar-fill.women { background: #8b5e3c; }
      .wk-kf-bar-fill.men   { background: rgba(100,80,50,0.3); }
      .wk-kf-val {
        font-size: 0.8rem; font-weight:600;
        color: #1a1208; min-width: 38px;
        text-align: right;
      }
      .wk-kf-who {
        font-size: 0.58rem; color:#9a8060;
        min-width: 50px; letter-spacing:0.06em;
        text-transform: uppercase;
      }
      .wk-kf-note {
        font-size: 0.65rem; font-style:italic;
        color: #8a7050; border-left: 2px solid #c4a060;
        padding-left: 0.7rem; line-height:1.5;
        opacity: 0; transition: opacity 0.5s 0.3s;
      }
      .wk-keyfigs.visible .wk-kf-note { opacity:1; }

      /* Source */
      .wk-source {
        position: absolute; bottom:1.2rem; right:1.5rem;
        font-size:0.56rem; color:#b0a080; font-style:italic;
        z-index:200; pointer-events:none;
      }
    `;
    document.head.appendChild(style);

    // ── DOM ──────────────────────────────────────────────────────────────────
    const sticky = document.createElement("div");
    sticky.className = "wk-sticky";
    container.appendChild(sticky);

    // Panneau texte
    const textPanel = document.createElement("div");
    textPanel.className = "wk-text";
    textPanel.innerHTML = `
      <div class="wk-eyebrow"  id="wk-eyebrow">La vie professionnelle</div>
      <div class="wk-headline" id="wk-headline">La répartition des genres dans le monde professionnel</div>
      <div class="wk-body"     id="wk-body">Chaque secteur est représenté par un pétale.<br><br>
        Son rayon intérieur indique la <em>part des femmes</em>.<br>
        Son épaisseur reflète le <em>poids du secteur</em> dans l'économie.</div>
      <div class="wk-note"     id="wk-note">Du plus féminin au plus masculin — les déséquilibres sont massifs.</div>
    `;
    sticky.appendChild(textPanel);

    // Zone droite
    const viz = document.createElement("div");
    viz.className = "wk-viz";
    sticky.appendChild(viz);

    // Source
    const srcEl = document.createElement("div");
    srcEl.className = "wk-source";
    srcEl.textContent = DATA.source;
    sticky.appendChild(srcEl);

    // Légende
    const legend = document.createElement("div");
    legend.className = "wk-legend";
    legend.innerHTML = `
      <div class="wk-legend-row"><div class="wk-legend-dot" style="background:#8b5e3c"></div>Part des femmes</div>
      <div class="wk-legend-row"><div class="wk-legend-dot" style="background:rgba(100,80,50,0.3);border:1px solid #9a8060"></div>Part des hommes</div>
      <div class="wk-legend-row"><div class="wk-legend-dot" style="background:transparent;border:1.5px solid #9a8060"></div>Poids dans l'économie</div>
    `;
    viz.appendChild(legend);

    // ── Fleur SVG ─────────────────────────────────────────────────────────────
    // Chaque pétale = arc SVG
    // R_inner = proportionnel à womenPct (max 80px)
    // R_outer = R_inner + épaisseur proportionnelle à shareOfWorkforce
    const CX = 0; // centre relatif au groupe SVG
    const CY = 0;
    const R_SCALE = 90;       // rayon max femmes
    const THICK_SCALE = 5;    // épaisseur par % workforce
    const N = DATA.sectors.length;
    const ANGLE_STEP = (2 * Math.PI) / N;
    const GAP = 0.08; // espace entre pétales en radians

    function polarToCartesian(cx, cy, r, angleRad) {
      return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad),
      };
    }

    function petalPath(cx, cy, rInner, rOuter, startAngle, endAngle) {
      const s1 = polarToCartesian(cx, cy, rInner, startAngle);
      const e1 = polarToCartesian(cx, cy, rInner, endAngle);
      const s2 = polarToCartesian(cx, cy, rOuter, endAngle);
      const e2 = polarToCartesian(cx, cy, rOuter, startAngle);
      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      return [
        `M ${s1.x.toFixed(2)} ${s1.y.toFixed(2)}`,
        `A ${rInner} ${rInner} 0 ${largeArc} 1 ${e1.x.toFixed(2)} ${e1.y.toFixed(2)}`,
        `L ${s2.x.toFixed(2)} ${s2.y.toFixed(2)}`,
        `A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${e2.x.toFixed(2)} ${e2.y.toFixed(2)}`,
        `Z`,
      ].join(" ");
    }

    // Dimensions SVG
    const SVG_SIZE = 360;
    const svgNS = "http://www.w3.org/2000/svg";

    const flowerWrap = document.createElement("div");
    flowerWrap.className = "wk-flower-wrap";
    viz.appendChild(flowerWrap);

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width",  String(SVG_SIZE));
    svg.setAttribute("height", String(SVG_SIZE));
    svg.setAttribute("viewBox", `${-SVG_SIZE/2} ${-SVG_SIZE/2} ${SVG_SIZE} ${SVG_SIZE}`);
    svg.style.overflow = "visible";
    flowerWrap.appendChild(svg);

    // Tige centrale
    const stem = document.createElementNS(svgNS, "line");
    stem.setAttribute("x1","0"); stem.setAttribute("y1","0");
    stem.setAttribute("x2","0"); stem.setAttribute("y2","140");
    stem.setAttribute("stroke","#5a7a35");
    stem.setAttribute("stroke-width","3");
    stem.setAttribute("stroke-linecap","round");
    stem.style.opacity = "0";
    svg.appendChild(stem);

    // Pétales
    const petalEls   = [];
    const labelEls   = [];
    const fallingEl  = { el: null, angle: 0, rI: 0, rO: 0 };

    DATA.sectors.forEach((sec, i) => {
      const startAngle = i * ANGLE_STEP - Math.PI/2 + GAP/2;
      const endAngle   = startAngle + ANGLE_STEP - GAP;
      const midAngle   = (startAngle + endAngle) / 2;

      const rInner = (sec.womenPct / 100) * R_SCALE;
      const rOuter = rInner + sec.shareOfWorkforce * THICK_SCALE;

      // Couleur : femmes = brun rosé, hommes = gris-beige
      const isFemale = sec.dominance === "female";
      const fillColor   = isFemale ? "#8b5e3c" : "rgba(120,100,70,0.28)";
      const strokeColor = isFemale ? "#6b3e1c" : "#9a8060";

      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", petalPath(CX, CY, rInner, rOuter, startAngle, endAngle));
      path.setAttribute("fill", fillColor);
      path.setAttribute("stroke", strokeColor);
      path.setAttribute("stroke-width", "1.5");
      path.style.opacity = "0";
      path.style.transformOrigin = "0 0";
      svg.appendChild(path);

      // % femmes en texte dans le pétale
      const midR = (rInner + rOuter) / 2;
      const midPt = polarToCartesian(CX, CY, midR, midAngle);
      const pctText = document.createElementNS(svgNS, "text");
      pctText.setAttribute("x", midPt.x.toFixed(1));
      pctText.setAttribute("y", midPt.y.toFixed(1));
      pctText.setAttribute("text-anchor", "middle");
      pctText.setAttribute("dominant-baseline", "middle");
      pctText.setAttribute("font-size", "9");
      pctText.setAttribute("font-family", "Lora, Georgia, serif");
      pctText.setAttribute("fill", isFemale ? "#f2ece0" : "#4a3820");
      pctText.style.opacity = "0";
      pctText.textContent = `${sec.womenPct}% F`;
      svg.appendChild(pctText);

      // Rayon extérieur (contour workforce)
      const outerArc = document.createElementNS(svgNS, "path");
      const rOuterMax = rOuter + 8;
      outerArc.setAttribute("d", petalPath(CX, CY, rOuter + 2, rOuterMax, startAngle, endAngle));
      outerArc.setAttribute("fill", "none");
      outerArc.setAttribute("stroke", "#9a8060");
      outerArc.setAttribute("stroke-width", "1");
      outerArc.setAttribute("stroke-dasharray", "3 3");
      outerArc.style.opacity = "0";
      svg.appendChild(outerArc);

      petalEls.push({ path, pctText, outerArc, sec, startAngle, endAngle, rInner, rOuter, midAngle });

      // Label extérieur
      const labelR = rOuter + 26;
      const labelPt = polarToCartesian(CX, CY, labelR, midAngle);
      const labelDiv = document.createElement("div");
      labelDiv.className = "wk-sector-label";
      labelDiv.textContent = sec.label;
      labelDiv.style.opacity = "0";
      // Position absolue dans viz, centré sur flowerWrap
      viz.appendChild(labelDiv);
      labelEls.push({ el: labelDiv, pt: labelPt, midAngle });

      // Pétale tombant (Construction)
      if (sec.falling) {
        fallingEl.rI = rInner;
        fallingEl.rO = rOuter;
        fallingEl.startAngle = startAngle;
        fallingEl.endAngle   = endAngle;
        fallingEl.midAngle   = midAngle;
      }
    });

    // Cercle central (tige / nœud)
    const center = document.createElementNS(svgNS, "circle");
    center.setAttribute("cx","0"); center.setAttribute("cy","0");
    center.setAttribute("r","8");
    center.setAttribute("fill","#5a7a35");
    center.style.opacity = "0";
    svg.appendChild(center);

    // ── Layer leadership ──────────────────────────────────────────────────────
    const leadershipEl = document.createElement("div");
    leadershipEl.className = "wk-leadership";
    DATA.leadership.forEach(row => {
      const div = document.createElement("div");
      div.className = "wk-lead-row";
      div.innerHTML = `
        <div class="wk-lead-label">${row.label}</div>
        <div class="wk-lead-bar-wrap">
          <div class="wk-lead-bar-women" style="width:0%"><span class="wk-lead-pct">${row.womenPct}%</span></div>
          <div class="wk-lead-bar-men"   style="width:${100-row.womenPct}%"></div>
        </div>
      `;
      leadershipEl.appendChild(div);
    });
    viz.appendChild(leadershipEl);

    // ── Layer chiffres clés ───────────────────────────────────────────────────
    const keyFigsEl = document.createElement("div");
    keyFigsEl.className = "wk-keyfigs";
    DATA.keyFigures.forEach(kf => {
      const div = document.createElement("div");
      div.className = "wk-kf-row";
      div.innerHTML = `
        <div class="wk-kf-label">${kf.label}</div>
        <div class="wk-kf-bars">
          <div class="wk-kf-bar-row">
            <div class="wk-kf-who">Femmes</div>
            <div class="wk-kf-bar-track">
              <div class="wk-kf-bar-fill women" style="width:0%" data-target="${kf.women}"></div>
            </div>
            <div class="wk-kf-val">${kf.women}%</div>
          </div>
          <div class="wk-kf-bar-row">
            <div class="wk-kf-who">Hommes</div>
            <div class="wk-kf-bar-track">
              <div class="wk-kf-bar-fill men" style="width:0%" data-target="${kf.men}"></div>
            </div>
            <div class="wk-kf-val">${kf.men}%</div>
          </div>
        </div>
        <div class="wk-kf-note">${kf.note}</div>
      `;
      keyFigsEl.appendChild(div);
    });
    viz.appendChild(keyFigsEl);

    // ── Positionnement dynamique des labels ───────────────────────────────────
    function positionLabels() {
      const wrapRect = flowerWrap.getBoundingClientRect();
      const vizRect  = viz.getBoundingClientRect();
      const offX = wrapRect.left - vizRect.left + SVG_SIZE / 2;
      const offY = wrapRect.top  - vizRect.top  + SVG_SIZE / 2;

      labelEls.forEach(({ el, pt }) => {
        el.style.left      = (offX + pt.x) + "px";
        el.style.top       = (offY + pt.y) + "px";
        el.style.transform = "translate(-50%, -50%)";
      });
    }

    // ── Narration ─────────────────────────────────────────────────────────────
    const scenes = [
      {
        eyebrow:  "Le monde professionnel",
        headline: "Une fleur à cinq pétales.",
        body:     `Chaque pétale représente un secteur économique.<br><br>
                   Son <em>rayon intérieur</em> indique la part des femmes.<br>
                   Son <em>épaisseur</em> reflète le poids du secteur<br>dans l'économie suisse.`,
        note:     "Du plus féminin au plus masculin.",
      },
      {
        eyebrow:  "Les secteurs s'ouvrent",
        headline: "Santé, enseignement, transports, information, construction.",
        body:     `Les secteurs se révèlent un à un.<br><br>
                   <strong>76%</strong> des travailleurs de la santé sont des femmes.<br>
                   <strong>10%</strong> seulement dans la construction.`,
        note:     "L'écart est de 66 points entre les deux extrêmes.",
      },
      {
        eyebrow:  "Le pétale qui tombe",
        headline: "Construction : 10% de femmes.",
        body:     `Le pétale le plus déséquilibré se détache.<br><br>
                   <strong>90% d'hommes</strong> dans la construction —<br>
                   le secteur le plus masculinisé du marché du travail.`,
        note:     "Ce déséquilibre n'est pas naturel. Il est construit.",
      },
      {
        eyebrow:  "Aux postes de direction",
        headline: "38,6% des dirigeants sont des femmes.",
        body:     `En progression, mais encore loin de la parité.<br><br>
                   Moins d'une femme sur deux accède aux postes<br>
                   de décision — <em>même dans les secteurs féminisés</em>.`,
        note:     "Source : OFS – ESPA 2025.",
      },
      {
        eyebrow:  "Le travail invisible",
        headline: "Dès l'arrivée d'un enfant, tout change.",
        body:     `<strong>60%</strong> des femmes réduisent leur activité<br>
                   pour s'occuper des enfants, contre <strong>13%</strong> des hommes.<br><br>
                   La contribution des femmes au revenu du ménage<br>
                   <em>chute à 28%</em> dès l'arrivée d'un enfant en bas âge.`,
        note:     "La carrière de Carole ne lui appartient pas entièrement.",
      },
    ];

    function setScene(idx) {
      const s = scenes[idx];
      textPanel.classList.remove("visible");
      setTimeout(() => {
        document.getElementById("wk-eyebrow").textContent = s.eyebrow;
        document.getElementById("wk-headline").innerHTML  = s.headline;
        document.getElementById("wk-body").innerHTML      = s.body;
        document.getElementById("wk-note").innerHTML      = s.note;
        textPanel.classList.add("visible");
      }, 200);
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    function initScene() {
      positionLabels();
      petalEls.forEach(({ path, pctText, outerArc }) => {
        path.style.opacity     = "0";
        pctText.style.opacity  = "0";
        outerArc.style.opacity = "0";
      });
      labelEls.forEach(({ el }) => { el.style.opacity = "0"; });
      stem.style.opacity   = "0";
      center.style.opacity = "0";
      legend.style.opacity = "0";
      leadershipEl.style.opacity = "0";
      keyFigsEl.style.opacity    = "0";
      keyFigsEl.classList.remove("visible");
    }

    // ── ScrollTrigger 1 : intro → fleur (0%→20%) ─────────────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "20% top",
      scrub: 1.8,
      onEnter() { setScene(0); },
      onUpdate(self) {
        const p = self.progress;
        stem.style.opacity   = String(p);
        center.style.opacity = String(p);
        legend.style.opacity = String(p);
      },
      onLeaveBack() { initScene(); },
    });

    // ── ScrollTrigger 2 : pétales s'ouvrent un à un (20%→50%) ───────────────
    ScrollTrigger.create({
      trigger: container,
      start: "20% top",
      end: "50% top",
      scrub: 1.8,
      onEnter() { setScene(1); },
      onUpdate(self) {
        const p = self.progress; // 0→1 sur les 4 premiers pétales
        const N_REVEAL = 4;
        petalEls.forEach(({ path, pctText, outerArc, sec }, i) => {
          if (sec.falling) return; // pétale tombant géré après
          const threshold = i / N_REVEAL;
          const localP = Math.max(0, Math.min(1, (p - threshold) * N_REVEAL));
          path.style.opacity     = String(localP);
          pctText.style.opacity  = String(localP * 0.9);
          outerArc.style.opacity = String(localP * 0.6);
          labelEls[i].el.style.opacity = String(localP);
          // Scale d'entrée
          path.style.transform = `scale(${0.6 + localP * 0.4})`;
        });
      },
      onLeaveBack() {
        setScene(0);
        petalEls.forEach(({ path, pctText, outerArc }) => {
          path.style.opacity = "0"; pctText.style.opacity = "0"; outerArc.style.opacity = "0";
        });
        labelEls.forEach(({ el }) => { el.style.opacity = "0"; });
      },
    });

    // ── ScrollTrigger 3 : pétale tombant (50%→62%) ───────────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: "50% top",
      end: "62% top",
      scrub: 1.8,
      onEnter() { setScene(2); },
      onUpdate(self) {
        const p = self.progress;
        // Révéler le pétale construction puis le faire "tomber"
        const fallingIdx = DATA.sectors.findIndex(s => s.falling);
        const { path, pctText, outerArc } = petalEls[fallingIdx];

        if (p < 0.3) {
          // Apparition rapide
          const lp = p / 0.3;
          path.style.opacity    = String(lp);
          pctText.style.opacity = String(lp * 0.9);
          outerArc.style.opacity= String(lp * 0.6);
          labelEls[fallingIdx].el.style.opacity = String(lp);
        } else {
          // Chute : translation + rotation + fade
          const fall = (p - 0.3) / 0.7;
          const translateY = fall * 180;
          const rotate     = fall * 35;
          const fadeOut    = 1 - fall * 0.9;
          path.style.transform    = `translateY(${translateY}px) rotate(${rotate}deg)`;
          path.style.opacity      = String(fadeOut);
          pctText.style.opacity   = String(fadeOut * 0.8);
          outerArc.style.opacity  = String(fadeOut * 0.5);
          labelEls[fallingIdx].el.style.opacity = String(1 - fall);
        }
      },
      onLeaveBack() { setScene(1); },
    });

    // ── ScrollTrigger 4 : leadership (62%→76%) ───────────────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: "62% top",
      end: "76% top",
      scrub: 1.8,
      onEnter() {
        setScene(3);
        // Animer les barres leadership
        setTimeout(() => {
          leadershipEl.querySelectorAll(".wk-lead-bar-women").forEach((bar, i) => {
            bar.style.width = DATA.leadership[i].womenPct + "%";
          });
        }, 300);
      },
      onUpdate(self) {
        const p = self.progress;
        // Fleur s'estompe, leadership apparaît
        petalEls.forEach(({ path, pctText }) => {
          path.style.opacity    = String(1 - p * 0.85);
          pctText.style.opacity = String(1 - p);
        });
        labelEls.forEach(({ el }) => { el.style.opacity = String(1 - p * 0.8); });
        leadershipEl.style.opacity = String(p);
      },
      onLeaveBack() {
        setScene(2);
        leadershipEl.style.opacity = "0";
        leadershipEl.querySelectorAll(".wk-lead-bar-women").forEach(bar => { bar.style.width = "0%"; });
        petalEls.forEach(({ path, pctText }) => {
          path.style.opacity = "1"; pctText.style.opacity = "0.9";
        });
        labelEls.forEach(({ el }) => { el.style.opacity = "1"; });
      },
    });

    // ── ScrollTrigger 5 : chiffres clés (76%→95%) ────────────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: "76% top",
      end: "95% top",
      scrub: 1.8,
      onEnter() {
        setScene(4);
        keyFigsEl.classList.add("visible");
        setTimeout(() => {
          keyFigsEl.querySelectorAll(".wk-kf-bar-fill").forEach(bar => {
            bar.style.width = bar.dataset.target + "%";
          });
        }, 300);
      },
      onUpdate(self) {
        const p = self.progress;
        leadershipEl.style.opacity = String(1 - p * 0.9);
        keyFigsEl.style.opacity    = String(p);
      },
      onLeaveBack() {
        setScene(3);
        keyFigsEl.style.opacity = "0";
        keyFigsEl.classList.remove("visible");
        keyFigsEl.querySelectorAll(".wk-kf-bar-fill").forEach(bar => { bar.style.width = "0%"; });
        leadershipEl.style.opacity = "1";
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
      setTimeout(() => { textPanel.classList.add("visible"); }, 350);
    }));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
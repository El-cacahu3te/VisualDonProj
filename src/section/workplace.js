import '../css/workplace.css'  // ← CSS externalisé
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

  const PETALS = [
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
  const GAP = 0.06;

  function build() {
    const container = document.getElementById("leTravail");
    if (!container) return console.warn("#leTravail introuvable");

    const sticky = document.createElement("div");
    sticky.className = "wk-sticky";
    container.appendChild(sticky);

    const textPanel = document.createElement("div");
    textPanel.className = "wk-text";
    textPanel.innerHTML = `
      <div class="wk-eyebrow"  id="wk-ey">Le monde professionnel</div>
      <div class="wk-headline" id="wk-hl">Une fleur, toutes les inégalités.</div>
      <div class="wk-body"     id="wk-bd">Chaque pétale représente un domaine ou une réalité.
        La partie <em>opaque</em> = la part des femmes.
        La partie <em>transparente</em> = la part des hommes.
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

    const petalInfo = document.createElement("div");
    petalInfo.className = "wk-petal-info";
    petalInfo.innerHTML = `
      <div class="wk-petal-info-pct" id="wk-info-pct"></div>
      <div class="wk-petal-info-note" id="wk-info-note"></div>
    `;
    viz.appendChild(petalInfo);

    const SVG_W = 1100, SVG_H = 1100;
    const CX = SVG_W / 2, CY = SVG_H / 2;
    const svgNS = "http://www.w3.org/2000/svg";
    const MIN_R = 42;

    const flowerWrap = document.createElement("div");
    flowerWrap.className = "wk-flower-wrap";
    viz.appendChild(flowerWrap);

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width",   String(SVG_W));
    svg.setAttribute("height",  String(SVG_H));
    svg.setAttribute("viewBox", `0 0 ${SVG_W} ${SVG_H}`);
    svg.style.overflow = "visible";
    flowerWrap.appendChild(svg);

    function pt(cx, cy, r, angle) {
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    }

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

    // ── Tige et feuille EN PREMIER — passent derrière les pétales ────────────
    const stem = document.createElementNS(svgNS, "path");
    stem.setAttribute("d", `M${CX} ${CY + MIN_R} C${CX - 20} ${CY + MIN_R + 120}, ${CX + 28} ${CY + MIN_R + 280}, ${CX - 5} ${CY + MIN_R + 420}`);
    stem.setAttribute("stroke", "#5a7a35");
    stem.setAttribute("stroke-width", "4.5");
    stem.setAttribute("stroke-linecap", "round");
    stem.setAttribute("fill", "none");
    svg.appendChild(stem);

    const leaf = document.createElementNS(svgNS, "path");
    leaf.setAttribute("d", `M${CX} ${CY + MIN_R + 220} Q${CX + 65} ${CY + MIN_R + 185} ${CX + 55} ${CY + MIN_R + 248}`);
    leaf.setAttribute("stroke", "#5a7a35");
    leaf.setAttribute("stroke-width", "2.5");
    leaf.setAttribute("stroke-linecap", "round");
    leaf.setAttribute("fill", "none");
    leaf.setAttribute("opacity", "0.7");
    svg.appendChild(leaf);

    // ── Pétales — ajoutés APRÈS la tige, donc par-dessus ─────────────────────
    const petalEls = [];
    const labelEls = [];

    PETALS.forEach((p, i) => {
      const startA = i * ANGLE_STEP - Math.PI / 2 + GAP / 2;
      const endA   = startA + ANGLE_STEP - GAP;
      const midA   = (startA + endA) / 2;

      const rFull  = p.radius;
      const rWomen = MIN_R + (rFull - MIN_R) * (p.womenPct / 100);

      const g = document.createElementNS(svgNS, "g");
      g.style.cursor = "pointer";
      g.style.opacity = "0";
      g.style.transformOrigin = `${CX}px ${CY}px`;

      const pathMen = document.createElementNS(svgNS, "path");
      pathMen.setAttribute("d", arcPath(CX, CY, MIN_R, rFull, startA, endA));
      pathMen.setAttribute("fill", p.color);
      pathMen.setAttribute("opacity", "0.15");
      pathMen.setAttribute("stroke", p.color);
      pathMen.setAttribute("stroke-width", "0.5");
      g.appendChild(pathMen);

      const pathWomen = document.createElementNS(svgNS, "path");
      pathWomen.setAttribute("d", arcPath(CX, CY, MIN_R, rWomen, startA, endA));
      pathWomen.setAttribute("fill", p.color);
      pathWomen.setAttribute("opacity", "0.85");
      g.appendChild(pathWomen);

      const pathBorder = document.createElementNS(svgNS, "path");
      pathBorder.setAttribute("d", arcPath(CX, CY, MIN_R, rFull, startA, endA));
      pathBorder.setAttribute("fill", "none");
      pathBorder.setAttribute("stroke", p.color);
      pathBorder.setAttribute("stroke-width", "1");
      pathBorder.setAttribute("opacity", "0.4");
      g.appendChild(pathBorder);

      const sepPath = document.createElementNS(svgNS, "path");
      sepPath.setAttribute("d", arcPath(CX, CY, rWomen - 1, rWomen + 1, startA + 0.01, endA - 0.01));
      sepPath.setAttribute("fill", p.color);
      sepPath.setAttribute("opacity", "0.5");
      g.appendChild(sepPath);

      const labelR  = MIN_R + (rWomen - MIN_R) * 0.55;
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

      g.addEventListener("mouseenter", () => {
        const dx = Math.cos(midA) * 30;
        const dy = Math.sin(midA) * 30;
        g.dataset.hovered = "1";
        g.style.transition = "transform 0.25s ease, opacity 0.25s ease";
        g.style.transform  = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        petalEls.forEach(other => {
          if (other.g !== g) {
            other.g.style.transition = "opacity 0.25s ease";
            other.g.style.opacity = "0.3";
          }
        });
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

      const labelRext = rFull + 42;
      const lp = pt(CX, CY, labelRext, midA);
      const labelDiv = document.createElement("div");
      labelDiv.className = "wk-petal-label";
      labelDiv.textContent = p.label;
      viz.appendChild(labelDiv);
      labelEls.push({ el: labelDiv, svgPt: lp, midA });
    });

    // ── Cercle central et point — par-dessus tout ─────────────────────────────
    const centerCircle = document.createElementNS(svgNS, "circle");
    centerCircle.setAttribute("cx", String(CX));
    centerCircle.setAttribute("cy", String(CY));
    centerCircle.setAttribute("r",  String(MIN_R));
    centerCircle.setAttribute("fill", "#f2ece0");
    centerCircle.setAttribute("stroke", "#c4a060");
    centerCircle.setAttribute("stroke-width", "1");
    svg.appendChild(centerCircle);

    const centerDot = document.createElementNS(svgNS, "circle");
    centerDot.setAttribute("cx", String(CX));
    centerDot.setAttribute("cy", String(CY));
    centerDot.setAttribute("r",  "4");
    centerDot.setAttribute("fill", "#5a7a35");
    svg.appendChild(centerDot);

    function positionLabels() {
      const wRect = flowerWrap.getBoundingClientRect();
      const vRect = viz.getBoundingClientRect();
      const ox = wRect.left - vRect.left;
      const oy = wRect.top  - vRect.top;
      labelEls.forEach(({ el, svgPt }) => {
        el.style.left      = (ox + svgPt.x) + "px";
        el.style.top       = (oy + svgPt.y) + "px";
        el.style.transform = "translate(-50%, -50%)";
      });
    }

    const scenes = [
      {
        ey: "Le monde professionnel",
        hl: "Une fleur, toutes les inégalités.",
        bd: `<p>Chaque pétale représente un domaine ou une réalité.</p>
             <p>La partie <em>opaque</em> = la part des femmes.<br>
             La partie <em>transparente</em> = la part des hommes.<br>
             Le rayon = le poids du secteur.</p>`,
        nt: "Survolez un pétale pour voir le détail.",
      },
      {
        ey: "Les secteurs professionnels",
        hl: "De 76% à 10%.",
        bd: `<p>La santé emploie <strong>76% de femmes</strong>.<br>
             La construction, seulement <strong>10%</strong>.</p>
             <p>Un écart de 66 points entre les deux extrêmes —<br>
             dans le même marché du travail.</p>`,
        nt: "Ces déséquilibres ne sont pas naturels. Ils sont construits.",
      },
      {
        ey: "Les inégalités structurelles",
        hl: "Même en travaillant, les écarts persistent.",
        bd: `<p><strong>38,6%</strong> des postes de direction seulement<br>
             sont occupés par des femmes.</p>
             <p><strong>59%</strong> des femmes actives travaillent à temps partiel,<br>
             contre <strong>20%</strong> des hommes.</p>`,
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

    function initScene() {
      positionLabels();
      petalEls.forEach(({ g }) => { g.style.opacity = "0"; });
      labelEls.forEach(({ el }) => { el.style.opacity = "0"; });
      legend.classList.remove("visible");
    }

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
        petalEls.forEach(({ g }, i) => {
          const thresh = (i / N) * 0.7;
          const lp = Math.max(0, Math.min(1, (p - thresh) / 0.3));
          g.style.opacity = String(lp);
          g.dataset.baseOpacity = String(lp);
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
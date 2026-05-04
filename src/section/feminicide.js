/**
 * src/section/feminicide.js — Scrollytelling "Féminicides en Suisse en 2025"
 * Optimisé : Utilise les données du fichier JSON externe
 */

// Importation des données JSON (ajuste le chemin selon ton architecture)
import DATA from '../data/feminicide.json';

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
    } else { 
      gsap.registerPlugin(ScrollTrigger); 
      build(); 
    }
  }

  function build() {
    const container = document.getElementById("féminicide");
    if (!container) return console.warn("#féminicide introuvable");

    // ── CSS (Variables dynamiques basées sur ton CSS global) ──────────────────
    const style = document.createElement("style");
    style.textContent = `
      #féminicide {
        position: relative; width: 100%; height: 400vh;
        background: var(--bg); font-family: var(--sans); color: var(--text);
      }
      .fm-sticky {
        position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden;
      }
      .fm-text {
        position: absolute; top: 0; left: 0; width: 40%; height: 100%;
        background: var(--bg); z-index: 100; display: flex; flex-direction: column;
        justify-content: center; padding: 3rem 2rem 3rem 4rem; box-sizing: border-box;
      }
      .fm-text::after {
        content: ''; position: absolute; top:0; right:-60px; width:60px; height:100%;
        background: linear-gradient(to right, var(--bg), transparent); pointer-events: none;
      }
      .fm-eyebrow {
        font-size: 0.62rem; letter-spacing:0.22em; text-transform: uppercase;
        opacity: 0.6; margin-bottom:1rem; transform:translateY(8px);
        transition: opacity 0.45s, transform 0.45s;
      }
      .fm-headline {
        font-family: var(--heading); font-size: clamp(2rem, 3.5vw, 3.2rem);
        color: var(--text-h); line-height: 1.1; margin-bottom: 1.4rem;
        opacity:0; transform:translateY(10px);
        transition: opacity 0.45s 0.07s, transform 0.45s 0.07s;
      }
      .fm-body {
        font-size: clamp(0.9rem, 1.1vw, 1.05rem); line-height:1.8;
        opacity:0; transform:translateY(8px);
        transition: opacity 0.45s 0.14s, transform 0.45s 0.14s;
      }
      .fm-body strong { color: var(--text-h); font-weight: 600; }
      .fm-note {
        margin-top: 1.4rem; font-size: 0.78rem; opacity: 0.8; font-style: italic;
        border-left: 3px solid var(--accent); padding-left: 1rem;
        transform: translateY(6px); transition: opacity 0.45s 0.21s, transform 0.45s 0.21s;
      }
      .fm-text.visible .fm-eyebrow, .fm-text.visible .fm-headline, 
      .fm-text.visible .fm-body, .fm-text.visible .fm-note { opacity:1; transform:translateY(0); }

      .fm-viz { position: absolute; top:0; left:40%; width:60%; height:100%; z-index:1; }
      .fm-grid {
        position: absolute; inset:0; display: flex; align-items: center; justify-content: center;
      }
      .fm-grid-inner {
        display: flex; flex-wrap: wrap; gap: clamp(4px, 1.5vw, 14px);
        justify-content: center; align-items: flex-end; padding: 1rem 2rem; max-width: 600px;
      }
      .fm-flower { position: relative; cursor: pointer; opacity: 0; flex-shrink: 0; }
      .fm-flower .fleur-svg { width: 45px; height: auto; display: block; }
      .fm-flower:hover .fm-tooltip { opacity:1; }

      .fm-tooltip {
        position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
        background: var(--code-bg); border: 1px solid var(--border); color: var(--text-h);
        font-size: 0.75rem; padding: 0.6rem 0.9rem; border-radius: 4px;
        opacity: 0; pointer-events: none; transition: opacity 0.2s; z-index: 50; box-shadow: var(--shadow);
      }
      .fm-tooltip .tip-city { font-weight: 600; color: var(--accent); }

      .fm-counter {
        position: absolute; bottom: 2.5rem; right: 2.5rem; font-family: var(--heading);
        font-size: clamp(3rem, 6vw, 5rem); color: var(--text-h); opacity:0; transition: opacity 0.5s;
      }
      .fm-counter-label {
        display: block; font-family: var(--sans); font-size: 0.75rem;
        color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;
      }
      .fm-source {
        position:absolute; bottom:1.2rem; right:1.5rem; font-size:0.6rem; 
        opacity: 0.5; font-style:italic;
      }
    `;
    document.head.appendChild(style);

    // ── Construction du DOM ──────────────────────────────────────────────────
    const sticky = document.createElement("div");
    sticky.className = "fm-sticky";
    container.appendChild(sticky);

    const textPanel = document.createElement("div");
    textPanel.className = "fm-text";
    textPanel.innerHTML = `
      <div class="fm-eyebrow" id="fm-eyebrow">${DATA.title}</div>
      <div class="fm-headline" id="fm-headline">Carole aurait eu 36 ans.</div>
      <div class="fm-body" id="fm-body">
        En ${DATA.year}, <strong>${DATA.totalVictims} femmes</strong> ont été tuées en Suisse.<br><br>
        ${DATA.description}
      </div>
      <div class="fm-note" id="fm-note">${DATA.note}</div>
    `;
    sticky.appendChild(textPanel);

    const viz = document.createElement("div");
    viz.className = "fm-viz";
    sticky.appendChild(viz);

    const counter = document.createElement("div");
    counter.className = "fm-counter";
    counter.innerHTML = `${DATA.totalVictims}<span class="fm-counter-label">vies volées</span>`;
    viz.appendChild(counter);

    const srcEl = document.createElement("div");
    srcEl.className = "fm-source";
    srcEl.textContent = `Source : ${DATA.source}`;
    sticky.appendChild(srcEl);

    const grid = document.createElement("div");
    grid.className = "fm-grid";
    const gridInner = document.createElement("div");
    gridInner.className = "fm-grid-inner";
    grid.appendChild(gridInner);
    viz.appendChild(grid);

    // ── Création des Fleurs depuis le JSON ──────────────────────────────────
    const flowerEls = DATA.victims.map((v) => {
      const wrap = document.createElement("div");
      wrap.className = "fm-flower";
      wrap.innerHTML = `<img src="/fleurfanee.svg" alt="Fleur" class="fleur-svg" />`;

      const tooltip = document.createElement("div");
      tooltip.className = "fm-tooltip";
      
      const ageStr = v.ageKnown ? `${v.age} ans` : "Âge inconnu";
      const monthLabel = DATA.byMonth.find(m => m.month === v.month)?.label || "";

      tooltip.innerHTML = `
        <div class="tip-city">${v.city} (${v.canton})</div>
        <div class="tip-age">${ageStr} — ${monthLabel} ${DATA.year}</div>
        ${v.note ? `<div class="tip-note">${v.note}</div>` : ""}
      `;
      
      wrap.appendChild(tooltip);
      gridInner.appendChild(wrap);
      return wrap;
    });

    // ── Animation Scroll ─────────────────────────────────────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "80% top",
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress;
        counter.style.opacity = Math.min(1, p * 3);
        
        flowerEls.forEach((el, i) => {
          const threshold = (i / flowerEls.length) * 0.8;
          const localP = Math.max(0, Math.min(1, (p - threshold) / 0.2));
          el.style.opacity = localP;
          el.style.transform = `scale(${0.5 + localP * 0.5}) translateY(${(1 - localP) * 15}px)`;
        });
      }
    });

    // Apparition initiale du texte
    setTimeout(() => textPanel.classList.add("visible"), 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
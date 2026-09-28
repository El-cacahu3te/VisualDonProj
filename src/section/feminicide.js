/**
 * src/section/feminicide.js — Scrollytelling "Féminicides en Suisse en 2025"
 * Optimisé : Utilise les données du fichier JSON externe
 */

// Importation des données JSON (ajuste le chemin selon ton architecture)
import DATA from '../data/feminicide.json';
import '../css/feminicide.css';

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

    // ── Construction du DOM ──────────────────────────────────────────────────
    const sticky = document.createElement("div");
    sticky.className = "fm-sticky";
    container.appendChild(sticky);

    const textPanel = document.createElement("div");
    textPanel.className = "fm-text";
    textPanel.innerHTML = `
      <div class="fm-eyebrow" id="fm-eyebrow">${DATA.title}</div>
      <div class="fm-headline" id="fm-headline">Carole aurait eu 39 ans.</div>
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
import p5 from "p5";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "../data/sport.json";

gsap.registerPlugin(ScrollTrigger);

export async function initSportChart() {
  const container = document.getElementById("leSport");
  if (!container) return;

  container.innerHTML = "";
  // ── DOM ────────────────────────────────────────────────────
  const stage = document.createElement("div");
  stage.className = "sport-scene";
  container.appendChild(stage);

  const sticky = document.createElement("div");
  sticky.className = "sport-sticky-scene";
  stage.appendChild(sticky);

  const canvasHolder = document.createElement("div");
  canvasHolder.className = "sport-canvas";
  sticky.appendChild(canvasHolder);

  const textPanel = document.createElement("div");
  textPanel.className = "sport-panel";
  textPanel.innerHTML = `
    <div class="sport-eyebrow">Freins aux pratiques sportives</div>
    <div class="sport-panel-title">Quand les freins empêchent les filles de continuer.</div>
    <div class="sport-body">
      45,2% des jeunes filles abandonnent le sport en France.<br><br>
      Les règles, le regard des autres et les horaires incompatibles rendent la pratique difficile.
    </div>
    <div class="sport-note">Chaque flèche représente un obstacle : certaines atteignent la cible, d'autres tombent avant.</div>
  `;
  sticky.appendChild(textPanel);

  const ratioPill = document.createElement("div");
   ratioPill.className = "sport-ratio-final";

  ratioPill.innerHTML = `
  <div class="sport-eyebrow">Résultat</div>
  <span class="sport-ratio-miss">45,2%</span>
  <span class="sport-ratio-label">ont arrêté malgré elles</span>
  <br><br>
  <span class="sport-ratio-hit">54,8%</span>
  <span class="sport-ratio-label">continuent de pratiqué malgré tout</span>
`;

  sticky.appendChild(ratioPill);

  const src = document.createElement("div");
  src.className = "sport-source";
  src.textContent =
    "MGEN – Janvier 2026 - Étude « Adolescentes & Sport : Le Grand Décrochage »";
  sticky.appendChild(src);

  // Animation du panneau texte
  textPanel.classList.add("visible");

  // ── Données ────────────────────────────────────────────────
  const FREINS = [
    { short: "Emploi du temps", pct: 23, color: "#5D816E" },
    { short: "Comportements déplacés", pct: 21, color: "#51687D" },
    { short: "Règles", pct: 20, color: "#51687D" },
    { short: "Corps & puberté", pct: 18, color: "#5D816E" },
    { short: "Jugement & image", pct: 18, color: "#A9BCAA" },
  ];

  // Flèches : 11 touchent la cible (55%), 9 tombent (45%) (freins)

  const ARROWS_DEF = [
    // Emploi du temps (2)
    { hits: false, freinIdx: 0, groupIndex: 0 },
    { hits: false, freinIdx: 0, groupIndex: 1 },
    // Comportements déplacés (2)
    { hits: false, freinIdx: 1, groupIndex: 0 },
    { hits: false, freinIdx: 1, groupIndex: 1 },
    // Règles (2)
    { hits: false, freinIdx: 2, groupIndex: 0 },
    { hits: false, freinIdx: 2, groupIndex: 1 },
    // Corps & puberté (1)
    { hits: false, freinIdx: 3, groupIndex: 0 },
    // Jugement & image (1)
    { hits: false, freinIdx: 4, groupIndex: 0 },
    // Continuent (11) — pas de frein, pas de groupIndex utile
    ...Array.from({ length: 11 }, (_, i) => ({
      hits: true,
      freinIdx: null,
      groupIndex: i,
    })),
  ];

  // ── État partagé ───────────────────────────────────────────
  const state = {
    progress: 0,
    W: 0,
    H: 0,
  };

  // ── p5 sketch ─────────────────────────────────────────────
  new p5((p) => {
    let ARCHER_X, ARCHER_Y;
    let TARGET_X, TARGET_Y;
    let GROUND_Y;
    let arrows = [];
    let archerPNG, targetPNG, arrowPNG;

    class Arrow {
      constructor(def, index, total) {
        this.hits = def.hits;
        this.frein = def.freinIdx !== null ? FREINS[def.freinIdx] : null;
        this.index = index;
        this.total = total;
        this.gIdx = def.groupIndex ?? 0;
        this.freinIdx = def.freinIdx ?? -1;

        //espace entre groupes = 90px, entre flèches du même groupe = 10px
        const GROUP_SPACING = 200;
        const INGROUP_OFFSET = 12;

        this.landOffsetX =
          this.freinIdx >= 0
            ? this.freinIdx * GROUP_SPACING + this.gIdx * INGROUP_OFFSET
            : index * 22;
      }

      computePos(globalProgress) {
        const delay = (this.index / this.total) * 0.6;
        const t = p.constrain((globalProgress - delay) / 0.4, 0, 1);

        const startX = ARCHER_X + 30;
        const startY = ARCHER_Y - 150; //hauteur de tir de l'archère
        if (this.hits) {
          // Ligne droite vers la cible, légèrement décalée en Y pour éviter superposition
          const endY = TARGET_Y - 120 + this.gIdx * 4; //même hauteur de tir, avec petit décalage vertical selon l'ordre d'arrivée sur la cible
          const cx = p.lerp(startX, TARGET_X - 40, t); //atterrissage légèrement à gauche du centre de la cible flèches
          const cy = p.lerp(startY, endY, t);
          return {
            x: cx,
            y: cy,
            t,
            planted: t >= 1,
            angle: Math.atan2(endY - startY, TARGET_X - startX),
          };
        } else {
          // Part droit puis tombe — point de chute décalé par groupe
          const landX = ARCHER_X + 100 + this.landOffsetX;
          const landY = GROUND_Y - 150;
          const finalAngle = Math.atan2(landY - startY, landX - startX);

          const cx = p.lerp(startX, landX, t);
          // Phase 1 : horizontal jusqu'à t=0.4, puis chute
          const straightEnd = 0.4;
          let cy, angle;
          if (t < straightEnd) {
            cy = startY; // vol horizontal
            angle = 0;
          } else {
            const fallT = (t - straightEnd) / (1 - straightEnd);
            cy = p.lerp(startY, landY, fallT * fallT);
            angle = p.lerp(0, finalAngle, Math.min(1, (t - straightEnd) * 3));
          }
          return { x: cx, y: cy, t, planted: t >= 0.99, angle, finalAngle };
        }
      }

      draw(globalProgress) {
        const pos = this.computePos(globalProgress);
        if (pos.t <= 0) return;

        const drawAngle = pos.planted
          ? this.hits
            ? 0
            : pos.finalAngle // conserve l'angle d'arrivée
          : pos.angle;

        p.push();
        p.translate(pos.x, pos.y);
        p.rotate(drawAngle);
        p.image(arrowPNG, -35, -9, 70, 35);
        p.pop();

        // Label uniquement quand plantée au sol
        if (pos.planted && !this.hits && this.frein) {
          const isLast =
            (this.freinIdx <= 2 && this.gIdx === 1) ||
            this.freinIdx >= 3;

          if (isLast) {
            const lx = pos.x;
            const ly = GROUND_Y - 100; // juste sous le point de chute

            // — fond pill —
            // — mesure dynamique des textes —
            p.textStyle(p.BOLD);
            p.textSize(18); // taille du pourcentage
            const pctStr = `${this.frein.pct}%`;
            const pctW = p.textWidth(pctStr);

            p.textStyle(p.NORMAL);
            p.textSize(15); // taille du label
            const labelW = p.textWidth(this.frein.short);

            // largeur = le plus large des deux + padding
            const PAD_X = 16;
            const PAD_Y = 6;
            const lineH = 20;
            const boxW = Math.max(pctW, labelW) + PAD_X * 2;
            const boxH = lineH * 2 + PAD_Y * 2;

            p.noStroke();
            p.fill(241, 187, 190, 50); // rose pâle semi-transparent
            p.rectMode(p.CENTER);
            p.rect(lx, ly + boxH / 2, boxW, boxH, 15); // fond arrondi
            // — pourcentage (grand, coloré) —
            p.fill(93, 129, 110);
            p.textAlign(p.CENTER, p.TOP);
            p.textStyle(p.BOLD);
            p.textSize(18);
            p.text(`${this.frein.pct}%`, lx, ly + PAD_Y);

            // — label (petit, neutre) —
            p.fill(80, 70, 60); // brun neutre — système 3
            p.textStyle(p.NORMAL);
            p.textSize(15);
            p.text(this.frein.short, lx, ly + PAD_Y + lineH);

            p.rectMode(p.CORNER); // reset
          }
        }
        
      }
    }

    p.setup = async () => {
      state.W = canvasHolder.offsetWidth;
      state.H = canvasHolder.offsetHeight;
      p.createCanvas(state.W, state.H).parent(canvasHolder);

      archerPNG = await p.loadImage("/archere.png");
      targetPNG = await p.loadImage("/cible.png");
      arrowPNG = await p.loadImage("/fleche.png");
      let arrowW = 200;
      let arrowH = 200;

      ARCHER_X = 120;
      ARCHER_Y = state.H - 250;
      TARGET_X = state.W - 200;
      TARGET_Y = state.H - 250; // même valeur que ARCHER_Y
      GROUND_Y = state.H - 100;

      arrows = ARROWS_DEF.map((def, i) => new Arrow(def, i, ARROWS_DEF.length));
    };

    p.windowResized = () => {
      state.W = canvasHolder.offsetWidth;
      state.H = canvasHolder.offsetHeight;
      p.resizeCanvas(state.W, state.H);

      ARCHER_X = 120;
      ARCHER_Y = state.H - 80;
      TARGET_X = state.W - 200;
      TARGET_Y = state.H - 80;
      GROUND_Y = state.H - 20;
      arrows = ARROWS_DEF.map((def, i) => new Arrow(def, i, ARROWS_DEF.length));
    };

    p.draw = () => {
      p.clear();
      p.image(archerPNG, ARCHER_X - 90, ARCHER_Y - 235, 189, 235);
      p.image(targetPNG, TARGET_X - 60, TARGET_Y - 160, 120, 160);

      arrows.forEach((arrow) => arrow.draw(state.progress));
    };
  });

  ScrollTrigger.create({
    trigger: stage,
    start: "top top",
    end: "bottom top",
    scrub: 1,
     onUpdate(self) {
        state.progress = self.progress;

       if (self.progress > 0.75) {
         ratioPill.classList.add("visible");
       } else {
         ratioPill.classList.remove("visible");
       }

       if (self.progress > 0.65) {
         textPanel.classList.remove("visible");  // panel intro part un peu avant
       } else {
         textPanel.classList.add("visible");
       }
       
     },    
  });

  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
}

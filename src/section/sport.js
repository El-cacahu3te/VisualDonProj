import p5 from 'p5';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data/sport.json';

gsap.registerPlugin(ScrollTrigger);

export async function initSportChart() {
   const container = document.getElementById('leSport');
   if (!container) return;

   container.innerHTML = '';
   // ── DOM ────────────────────────────────────────────────────
   const stage = document.createElement('div');
   stage.className = 'sport-scene';
   container.appendChild(stage);

   const sticky = document.createElement('div');
   sticky.className = 'sport-sticky-scene';
   stage.appendChild(sticky);

   const canvasHolder = document.createElement('div');
   canvasHolder.className = 'sport-canvas';
   sticky.appendChild(canvasHolder);

   // Titre centré en haut
   const titleEl = document.createElement('div');
   titleEl.className = 'sport-title';
   titleEl.innerHTML = `
    <span class="sport-title-main">Le grand décrochage</span>
    <span class="sport-title-sub">
      <strong>2 984 000</strong> jeunes filles concernées en France
    </span>
  `;
   sticky.appendChild(titleEl);

   // Ratio pill en haut à droite
   const ratioPill = document.createElement('div');
   ratioPill.className = 'sport-ratio';
   ratioPill.innerHTML = `
    <span class="sport-ratio-hit">54,8% continuent</span>
    <span class="sport-ratio-sep">·</span>
    <span class="sport-ratio-miss">45,2% abandonnent</span>
  `;
   sticky.appendChild(ratioPill);

   // ── Données ────────────────────────────────────────────────
   const FREINS = [
      {
         id: 1,
         short: 'Règles',
         label: 'Les règles empêchent la pratique',
         pct: 53,
         color: '#51687D',
      },
      {
         id: 2,
         short: 'Corps & puberté',
         label: 'Changements physiques rendent le sport moins agréable',
         pct: 49,
         color: '#5D816E',
      },
      {
         id: 3,
         short: 'Jugement & image',
         label: 'Sentiment d\'être jugée ou mal à l\'aise avec son apparence',
         pct: 49,
         color: '#A9BCAA',
      },
      {
         id: 4,
         short: 'Comportements déplacés',
         label: '55% témoins · 42% victimes de comportements déplacés',
         pct: 55,
         color: '#51687D',
      },
      {
         id: 5,
         short: 'Emploi du temps',
         label: 'Horaires incompatibles avec le rythme scolaire',
         pct: 62,
         color: '#5D816E',
      },
   ];

   // Flèches : 5 qui tombent (freins) + 6 qui atteignent (continuent)
   const ARROWS_DEF = [
      { hits: false, freinIdx: 0 },
      { hits: true, freinIdx: null },
      { hits: false, freinIdx: 1 },
      { hits: true, freinIdx: null },
      { hits: false, freinIdx: 2 },
      { hits: true, freinIdx: null },
      { hits: false, freinIdx: 3 },
      { hits: true, freinIdx: null },
      { hits: false, freinIdx: 4 },
      { hits: true, freinIdx: null },
      { hits: true, freinIdx: null },
   ];

   // ── État partagé ───────────────────────────────────────────
   const state = {
      progress: 0,
      W: 0,
      H: 0,
   };

   // ── Charger les SVG ────────────────────────────────────────
   let archerSVG, targetSVG, arrowSVG;
   function loadSVG(url) {
      return new Promise((resolve, reject) => {
         const img = new Image();
         img.onload = () => resolve(img);
         img.onerror = reject;
         img.src = url;
      });
   }
    
   // ── p5 sketch ─────────────────────────────────────────────
   new p5((p) => {
      console.log('p5 initialized');
      let ARCHER_X, ARCHER_Y;
      let TARGET_X, TARGET_Y;
      let GROUND_Y;
      let arrows = [];

      class Arrow {
         constructor(def, index, total) {
            this.hits = def.hits;
            this.frein = def.freinIdx !== null ? FREINS[def.freinIdx] : null;
            this.index = index;
            this.total = total;
            this.launchOffset = index * (1 / total) * 0.7;
         }

         computePos(globalProgress) {
            const start = this.launchOffset;
            const end = start + 0.25;
            let t = (globalProgress - start) / (end - start);
            t = Math.max(0, Math.min(1, t));

            if (this.hits) {
               const cx = p.lerp(ARCHER_X + 30, TARGET_X, t);
               const arcH = -state.H * 0.35;
               const cy = p.lerp(ARCHER_Y - 60, TARGET_Y, t) + arcH * 4 * t * (1 - t);
               return { x: cx, y: cy, t, planted: t >= 1, angle: this.hitAngle(t) };
            } else {
               const maxX = ARCHER_X + 30 + (TARGET_X - ARCHER_X - 30) * (0.45 + this.index * 0.04);
               const cx = p.lerp(ARCHER_X + 30, maxX, t);
               const arcH = -state.H * 0.28;
               const cy = p.lerp(ARCHER_Y - 60, GROUND_Y - 100, t) + arcH * 4 * t * (1 - t);
               return { x: cx, y: Math.min(cy, GROUND_Y - 60), t, planted: t >= 0.98, angle: this.fallAngle(t) };
            }
         } 

         hitAngle(t) {
            const dt = 0.01;
            const t2 = Math.min(1, t + dt);
            const x1 = p.lerp(ARCHER_X + 30, TARGET_X, t);
            const y1 = p.lerp(ARCHER_Y - 60, TARGET_Y, t) + (-state.H * 0.35) * 4 * t * (1 - t);
            const x2 = p.lerp(ARCHER_X + 30, TARGET_X, t2);
            const y2 = p.lerp(ARCHER_Y - 60, TARGET_Y, t2) + (-state.H * 0.35) * 4 * t2 * (1 - t2);
            return Math.atan2(y2 - y1, x2 - x1);
         }

         fallAngle(t) {
            const dt = 0.01;
            const t2 = Math.min(1, t + dt);
            const maxX = ARCHER_X + 30 + (TARGET_X - ARCHER_X - 30) * (0.45 + this.index * 0.04);
            const x1 = p.lerp(ARCHER_X + 30, maxX, t);
            const y1 = p.lerp(ARCHER_Y - 60, GROUND_Y, t) + (-state.H * 0.28) * 4 * t * (1 - t);
            const x2 = p.lerp(ARCHER_X + 30, maxX, t2);
            const y2 = p.lerp(ARCHER_Y - 60, GROUND_Y, t2) + (-state.H * 0.28) * 4 * t2 * (1 - t2);
            return Math.atan2(y2 - y1, x2 - x1);
         }

         draw(globalProgress) {
            const pos = this.computePos(globalProgress);
            if (pos.t <= 0) return;

            p.push();
            p.translate(pos.x, pos.y);

            if (pos.planted) {
               const finalAngle = this.hits ? -0.15 : Math.PI * 0.45;
               p.rotate(finalAngle);
            } else {
               p.rotate(pos.angle);
            }

            p.image(arrowSVG, -30, -10, 60, 20); 

            p.pop();

            if (pos.planted && this.frein && pos.t >= 1) {
               p.fill(0);
               p.noStroke();
               p.textAlign(p.CENTER, p.CENTER);
               p.textSize(12);
               p.text(this.frein.short, pos.x, pos.y + 30);
            }
         }
      }

      p.setup = async () => {
         console.log('p5 setup');
         state.W = canvasHolder.offsetWidth;
         state.H = canvasHolder.offsetHeight;
         p.createCanvas(state.W, state.H).parent(canvasHolder);
         archerSVG = await p.loadImage('/archere.png');
         targetSVG = await p.loadImage('/cible.png');
         arrowSVG =  await p.loadImage('/fleche.png');
       
         ARCHER_X = 120;
         ARCHER_Y = state.H - 80;
         TARGET_X = state.W - 200;
         TARGET_Y = state.H - 80; // même valeur que ARCHER_Y
         GROUND_Y = state.H - 20;

         arrows = ARROWS_DEF.map((def, i) => new Arrow(def, i, ARROWS_DEF.length));
      };

      p.windowResized = () => {
         state.W = canvasHolder.offsetWidth;
         state.H = canvasHolder.offsetHeight;
         p.resizeCanvas(state.W, state.H);

         ARCHER_X = 120;
         ARCHER_Y = state.H - 80;
         TARGET_X = state.W - 200;
         TARGET_Y = state.H * 0.45;
         GROUND_Y = state.H - 20;
      };

      p.draw = () => {
         p.clear();
         p.image(archerSVG, ARCHER_X - 100, ARCHER_Y - 200, 200, 200);
         p.image(targetSVG, TARGET_X - 100, TARGET_Y - 100, 200, 200);
         arrows.forEach(arrow => arrow.draw(state.progress));
      };
       
   });

   ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate(self) {
         state.progress = self.progress;
      },
   });

   window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
   });
}
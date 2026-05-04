import p5 from 'p5';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSportChart() {
   const container = document.getElementById('leSport');
   if (!container) return;


   // 2. STRUCTURE DOM (reconstruite)
   const stage = document.createElement('div');
   stage.className = 'sport-scene';
   container.appendChild(stage);

   const sticky = document.createElement('div');
   sticky.className = 'sport-sticky-scene';
   stage.appendChild(sticky);

   // 3. CONTENEUR P5 (nouveau)
   const p5Container = document.createElement('div');
   p5Container.className = 'sport-p5-container';
   p5Container.style.position = 'relative';
   p5Container.style.width = '100%';
   p5Container.style.height = '100vh';
   sticky.appendChild(p5Container);

   // 4. CONTENEUR TEXTE/GRAPHIQUE (conservé)
   const contentContainer = document.createElement('div');
   contentContainer.className = 'sport-content-container';
   sticky.appendChild(contentContainer);

   // 5. INSTANCE P5 (fonctionnelle)
   const sketch = (p) => {
      let archerImg, targetImg, arrowImg;
      let progress = 0;

      p.preload = () => {
         archerImg = p.loadImage('/archere.svg');
         targetImg = p.loadImage('/cible.svg');
         arrowImg = p.loadImage('/flèche.svg');
      };

      p.setup = () => {
         const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
         canvas.parent(p5Container);
         p.noLoop(); // Crucial pour ScrollTrigger
      };

      p.draw = () => {
         p.background(255, 0); // Transparent

         // POSITIONNEMENT DES ÉLÉMENTS (à adapter)
         if (archerImg) p.image(archerImg, 100, p.height / 2 - 100, 200, 200);
         if (targetImg) p.image(targetImg, p.width - 300, p.height / 2 - 100, 200, 200);

         // Animation de la flèche (exemple)
         if (arrowImg) {
            const arrowX = 100 + 200 + (p.width - 600) * progress;
            p.image(arrowImg, arrowX, p.height / 2 - 20, 100, 40);
         }
      };
   };

   // 6. INITIALISATION P5
   new p5(sketch);

   // 7. ANIMATION SCROLLTRIGGER (reconstruite)
   gsap.to({}, {
      scrollTrigger: {
         trigger: stage,
         start: "top top",
         end: "bottom top",
         scrub: true,
         onUpdate: (self) => {
            // Met à jour la variable 'progress' utilisée dans p.draw()
            if (window.p5Instance) {
               window.p5Instance.progress = self.progress;
               window.p5Instance.redraw();
            }
         }
      }
   });
}

import data from '../data/sport.json';

export function initSportChart() {
  const container = document.getElementById('leSport');
  if (!container) return;

  function loadScript(src, onload) {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = onload;
    document.head.appendChild(script);
  }

  function loadGSAP(next) {
    if (typeof gsap === 'undefined') {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', () => {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', next);
      });
    } else if (typeof ScrollTrigger === 'undefined') {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', next);
    } else {
      next();
    }
  }

  function init() {
    if (typeof p5 === 'undefined') {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.8.0/p5.min.js', () => {
        loadGSAP(build);
      });
    } else {
      loadGSAP(build);
    }
  }

  function build() {
    gsap.registerPlugin(ScrollTrigger);

    container.querySelectorAll('p').forEach((p) => p.remove());

    const stage = document.createElement('div');
    stage.className = 'sport-scene';
    container.appendChild(stage);

    const sticky = document.createElement('div');
    sticky.className = 'sport-sticky-scene';
    stage.appendChild(sticky);

    const canvasHolder = document.createElement('div');
    canvasHolder.className = 'sport-canvas';
    sticky.appendChild(canvasHolder);

    const overlay = document.createElement('div');
    overlay.className = 'sport-text-overlay';
    overlay.innerHTML = `
      <span class="sport-text-label">La flèche et le choix de continuer</span>
      <span class="sport-text-desc" id="sport-desc">Certaines filles continuent le sport. D'autres voient leur flèche tomber, portée par les 5 raisons principales de l'arrêt.</span>
      <span class="sport-stage-badge" id="sport-stage">Étape 1 sur 7</span>
    `;
    sticky.appendChild(overlay);

    const reasons = data.resultats_detailles_par_question
      .filter((q) => [1, 2, 4, 5, 6].includes(q.question_id))
      .map((q) => ({
        title: q.enonce,
        label: q.enonce.length > 75 ? q.enonce.slice(0, 75) + '…' : q.enonce,
        percent: q.ventilation_sociodemographique?.region
          ?.find((r) => r.groupe === 'Île-de-France')
          ?.accord_pct || 0,
      }));

    const scenes = [
      {
        title: 'La cible est posée',
        desc: 'L’archère vise une cible symbolique : les filles qui continuent le sport malgré les obstacles.',
      },
      ...reasons.map((reason, index) => ({
        title: `Raison ${index + 1} : ${reason.label}`,
        desc: reason.title,
      })),
      {
        title: 'Le passage des flèches',
        desc: 'Les flèches qui atteignent la cible représentent les filles qui ont continué le sport.',
      },
      {
        title: 'Un récit en mouvement',
        desc: 'Le scrollytelling fait évoluer le visage de l’archère et la trajectoire des flèches.',
      },
    ];

    const sketchState = {
      progress: 0,
      stage: 0,
      labels: scenes,
      arrows: [],
      width: 0,
      height: 0,
    };

    class Arrow {
      constructor(index, hitsTarget, reason) {
        this.index = index;
        this.hitsTarget = hitsTarget;
        this.reason = reason;
        this.reset();
      }

      reset() {
        this.x = 120;
        this.y = sketchState.height - 120;
        this.angle = -0.35;
        this.baseSpeed = 0.9 + this.index * 0.1;
        this.targetX = sketchState.width - 160;
        this.targetY = sketchState.height * 0.45 - this.index * 24;
        this.fallX = 140 + this.index * 40;
        this.fallY = sketchState.height + 60;
      }

      update(progress) {
        const p = Math.min(1, Math.max(0, progress));
        const travel = this.hitsTarget ?
          p :
          Math.min(1, p * 1.1);

        if (this.hitsTarget) {
          this.x = 120 + (this.targetX - 120) * travel;
          this.y = sketchState.height - 120 + (this.targetY - (sketchState.height - 120)) * travel;
        } else {
          const fallProgress = Math.min(1, travel);
          const midY = sketchState.height * 0.3;
          this.x = 120 + (this.fallX - 120) * fallProgress;
          this.y = sketchState.height - 120 + (midY - (sketchState.height - 120)) * Math.min(1, fallProgress * 0.6) + (this.fallY - midY) * Math.max(0, fallProgress - 0.6) * 2.5;
        }
        this.angle = Math.atan2((this.hitsTarget ? this.targetY : this.fallY) - (sketchState.height - 120), (this.hitsTarget ? this.targetX : this.fallX) - 120) - 0.1;
      }

      draw(p) {
        p.push();
        p.translate(this.x, this.y);
        p.rotate(this.angle);
        p.strokeWeight(3);
        p.stroke(this.hitsTarget ? '#1e7b3a' : '#bf2e2e');
        p.line(0, 0, 80, 0);
        p.line(0, 0, -12, -4);
        p.line(0, 0, -12, 4);
        p.fill(this.hitsTarget ? '#1e7b3a' : '#bf2e2e');
        p.noStroke();
        p.triangle(80, 0, 70, -6, 70, 6);
        p.pop();
      }
    }

    function createArrows() {
      sketchState.arrows = [];
      const continuedCount = 3;
      for (let i = 0; i < reasons.length; i += 1) {
        sketchState.arrows.push(new Arrow(i, false, reasons[i]));
      }
      for (let i = 0; i < continuedCount; i += 1) {
        sketchState.arrows.push(new Arrow(reasons.length + i, true, null));
      }
    }

    const sketch = new p5((p) => {
      p.setup = () => {
        sketchState.width = canvasHolder.offsetWidth;
        sketchState.height = canvasHolder.offsetHeight;
        p.createCanvas(sketchState.width, sketchState.height).parent(canvasHolder);
        createArrows();
      };

      p.windowResized = () => {
        sketchState.width = canvasHolder.offsetWidth;
        sketchState.height = canvasHolder.offsetHeight;
        p.resizeCanvas(sketchState.width, sketchState.height);
        sketchState.arrows.forEach((arrow) => arrow.reset());
      };

      p.draw = () => {
        p.clear();
        p.noFill();
        p.stroke('#b9d7f0');
        p.strokeWeight(2);
        p.rect(0, 0, sketchState.width, sketchState.height, 32);
        drawTarget(p);
        drawArcher(p);
        sketchState.arrows.forEach((arrow) => arrow.draw(p));
      };

      function drawTarget(p) {
        const tx = sketchState.width - 160;
        const ty = sketchState.height * 0.45;
        const radii = [50, 34, 20, 10];
        radii.forEach((r, index) => {
          p.stroke(index % 2 === 0 ? '#f4d35e' : '#ee964b');
          p.strokeWeight(index === 0 ? 14 : 8);
          p.noFill();
          p.circle(tx, ty, r * 2);
        });
        p.fill('#1e7b3a');
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(18);
        p.text('CIBLE', tx, ty);
      }

      function drawArcher(p) {
        const baseY = sketchState.height - 80;
        p.stroke('#2a2a2a');
        p.strokeWeight(5);
        p.line(120, baseY, 120, baseY - 90);
        p.strokeWeight(3);
        p.line(120, baseY - 90, 160, baseY - 70);
        p.line(120, baseY - 60, 180, baseY - 60);
        p.fill('#2a2a2a');
        p.noStroke();
        p.ellipse(120, baseY - 100, 28, 28);
        p.fill('#77b7f3');
        p.rect(100, baseY - 50, 40, 50, 12);
      }
    });

    function updateText(index) {
      const title = scenes[index]?.title || scenes[0].title;
      const desc = scenes[index]?.desc || scenes[0].desc;
      const badge = `${index + 1} / ${scenes.length}`;
      overlay.querySelector('.sport-text-label').textContent = title;
      overlay.querySelector('.sport-text-desc').textContent = desc;
      overlay.querySelector('.sport-stage-badge').textContent = badge;
    }

    updateText(0);

    ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate(self) {
        sketchState.progress = self.progress;
        sketchState.arrows.forEach((arrow, index) => {
          const arrowProgress = self.progress * 1.2 - index * 0.05;
          arrow.update(arrowProgress);
        });
        const stepped = Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length));
        if (stepped !== sketchState.stage) {
          sketchState.stage = stepped;
          updateText(stepped);
        }
      },
    });

    window.addEventListener('resize', () => {
      sketchState.arrows.forEach((arrow) => arrow.reset());
      sketch.resizeCanvas(canvasHolder.offsetWidth, canvasHolder.offsetHeight);
      ScrollTrigger.refresh();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
  

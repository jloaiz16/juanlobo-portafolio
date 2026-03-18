import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  viewChild,
} from '@angular/core';

interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  speed: number;
  phase: number;
  bright: boolean;
}

@Component({
  selector: 'app-star-canvas',
  template: `<canvas #canvas></canvas>`,
  styles: [
    `
      :host {
        display: block;
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        // Stars fade out as the user scrolls past the hero
        opacity: calc(1 - clamp(0, var(--scroll-progress, 0) * 3.5, 1));
      }
      canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class StarCanvas implements OnDestroy {
  private readonly canvasRef =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private rafId = 0;
  private ro!: ResizeObserver;

  constructor(private ngZone: NgZone) {
    afterNextRender(() => this.init());
  }

  private init(): void {
    const el = this.canvasRef().nativeElement;
    this.ctx = el.getContext('2d')!;
    this.resize(el);
    this.spawn(el);

    this.ro = new ResizeObserver(() => {
      this.resize(el);
      this.spawn(el);
    });
    this.ro.observe(document.documentElement);

    this.ngZone.runOutsideAngular(() => this.tick());
  }

  private resize(el: HTMLCanvasElement): void {
    el.width = window.innerWidth;
    el.height = window.innerHeight;
  }

  private spawn(el: HTMLCanvasElement): void {
    const count = Math.floor((el.width * el.height) / 2800);
    this.stars = Array.from({ length: count }, () => {
      const bright = Math.random() < 0.06;
      return {
        x: Math.random() * el.width,
        y: Math.random() * el.height,
        r: bright ? Math.random() * 1.4 + 0.7 : Math.random() * 0.7 + 0.15,
        base: Math.random() * 0.45 + (bright ? 0.45 : 0.15),
        speed: Math.random() * 0.7 + 0.15,
        phase: Math.random() * Math.PI * 2,
        bright,
      };
    });
  }

  private tick(): void {
    const el = this.canvasRef().nativeElement;
    const ctx = this.ctx;
    const t = performance.now() * 0.001;

    ctx.clearRect(0, 0, el.width, el.height);

    // Draw star bodies
    for (const s of this.stars) {
      const tw = Math.sin(t * s.speed + s.phase) * 0.28;
      const op = Math.max(0, Math.min(1, s.base + tw));

      ctx.shadowBlur = s.bright ? 8 : 0;
      ctx.shadowColor = `rgba(210, 225, 255, ${op * 0.7})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(225, 235, 255, ${op})`;
      ctx.fill();
    }

    // Draw sparkle crosses on the brightest stars (like the reference)
    ctx.shadowBlur = 0;
    for (const s of this.stars) {
      if (!s.bright) continue;
      const tw = Math.sin(t * s.speed + s.phase) * 0.28;
      const op = Math.max(0, Math.min(1, s.base + tw)) * 0.5;
      const len = s.r * 4.5;

      ctx.strokeStyle = `rgba(225, 235, 255, ${op})`;
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      ctx.moveTo(s.x - len, s.y);
      ctx.lineTo(s.x + len, s.y);
      ctx.moveTo(s.x, s.y - len);
      ctx.lineTo(s.x, s.y + len);
      ctx.stroke();
    }

    this.rafId = requestAnimationFrame(() => this.tick());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.ro?.disconnect();
  }
}

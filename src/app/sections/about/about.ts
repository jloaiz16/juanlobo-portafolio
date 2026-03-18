import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about-section',
  imports: [MatIconModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutSection implements OnDestroy {
  private readonly sectionRef = viewChild.required<ElementRef>('sectionRef');
  readonly visible = signal(false);
  private io?: IntersectionObserver;

  readonly skills = [
    'Angular', 'Signals', 'RxJS', 'NgRx',
    'Module Federation', 'ReactJS', 'TypeScript', 'JavaScript',
    'Java (Spring Boot)', 'Python (Django)', 'Node.js',
    'PostgreSQL', 'Oracle', 'Jest', 'AWS', 'Git',
  ];

  constructor(private ngZone: NgZone) {
    afterNextRender(() => {
      this.io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.ngZone.run(() => this.visible.set(true));
            this.io?.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      this.io.observe(this.sectionRef().nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}

import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  signal,
  viewChildren,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  current?: boolean;
}

@Component({
  selector: 'app-experience-section',
  imports: [MatIconModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class ExperienceSection implements OnDestroy {
  private readonly cardRefs = viewChildren<ElementRef>('expCard');
  readonly visibleCards = signal<Set<number>>(new Set());
  private io?: IntersectionObserver;

  readonly items: ExperienceItem[] = [
    {
      role: 'Senior Software Developer',
      company: 'Lean Solutions Group',
      period: '06/2022 — Present',
      description:
        'Architected scalable frontend ecosystems using Angular and Micro-frontend architecture (Module Federation) with complex dependency management. Engineered high-performance NgRx state management for enterprise applications and integrated Generative AI capabilities to enhance product features and developer productivity. Led end-to-end development with a Django/PostgreSQL backend.',
      skills: ['Angular', 'Module Federation', 'NgRx', 'Django', 'PostgreSQL', 'Jest', 'AI'],
      current: true,
    },
    {
      role: 'Full Stack Software Developer',
      company: 'Lean Tech',
      period: '06/2019 — 06/2022',
      description:
        'Led and mentored cross-functional teams delivering high-impact solutions via SCRUM. Architected Angular (NgRx/RxJS) and React systems with real-time data visualization (Socket.io, ApexCharts). Implemented AI-driven features including facial recognition with OpenCV and AWS Rekognition. Developed robust backends using Node.js, Django, PostgreSQL, and Firebase.',
      skills: ['Angular', 'React', 'NgRx', 'RxJS', 'Node.js', 'Django', 'AWS Rekognition'],
    },
    {
      role: 'Software Developer',
      company: 'Seguros SURA',
      period: '05/2018 — 06/2019',
      description:
        'Developed and sustained tech infrastructure for the Claims & Insurance division, serving thousands of daily transactions. Built Angular/TypeScript frontends and scalable Java Spring Boot APIs. Performed massive data migrations and reporting through advanced PL/SQL and Oracle tuning.',
      skills: ['Angular', 'TypeScript', 'Java', 'Spring Boot', 'PL/SQL', 'Oracle'],
    },
    {
      role: 'IT Support',
      company: 'EAFIT University',
      period: '05/2017 — 05/2018',
      description:
        'Provisioned hardware infrastructure for postgraduate seminars and administered Qualtrics-based survey data flows into relational databases. Automated Excel-based reporting and provided high-level technical consultancy to faculty.',
      skills: ['SQL', 'Excel Automation', 'Hardware Infrastructure'],
    },
  ];

  constructor(private ngZone: NgZone) {
    afterNextRender(() => {
      this.io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = Number(
                (entry.target as HTMLElement).dataset['idx'],
              );
              this.ngZone.run(() =>
                this.visibleCards.update((s) => new Set([...s, idx])),
              );
            }
          });
        },
        { threshold: 0.18 },
      );

      for (const ref of this.cardRefs()) {
        this.io.observe(ref.nativeElement);
      }
    });
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}

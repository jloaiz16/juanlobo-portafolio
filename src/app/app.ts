import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StarCanvas } from './shared/star-canvas/star-canvas';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StarCanvas],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private _removeScroll?: () => void;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      let pending = false;

      const onScroll = () => {
        if (pending) return;
        pending = true;

        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const max =
            document.documentElement.scrollHeight - window.innerHeight;
          const progress = max > 0 ? scrollY / max : 0;

          const root = document.documentElement;
          root.style.setProperty('--scroll-y', String(scrollY));
          root.style.setProperty('--scroll-progress', progress.toFixed(4));

          pending = false;
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      this._removeScroll = () => window.removeEventListener('scroll', onScroll);
    });
  }

  ngOnDestroy(): void {
    this._removeScroll?.();
  }
}

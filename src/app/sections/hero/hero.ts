import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hero-section',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroSection {
  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}

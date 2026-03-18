import { Component } from '@angular/core';
import { HeroSection } from '../../sections/hero/hero';
import { AboutSection } from '../../sections/about/about';
import { ExperienceSection } from '../../sections/experience/experience';

@Component({
  selector: 'app-home-page',
  imports: [HeroSection, AboutSection, ExperienceSection],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {}

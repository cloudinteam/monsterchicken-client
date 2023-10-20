import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {

  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) {

  }

  ngOnInit(): void {
    this.titleService.setTitle('Monster Foods | Buy Fresh Chicken Online | Best Price Online Raw Chicken');
    this.metaService.updateTag({ name: 'title', content: 'Monster Foods | Buy Fresh Chicken Online | Best Price Online Raw Chicken' });
    this.metaService.updateTag({ name: 'keywords', content: 'Monsterchicken, chickenbuyonline, freshchicken, best fresh chicken, best fresh chicken online, online chicken, Chicken bulk order, bulk order, buy chicken at namakkal, best chicken in namakkal, quality chicken online, Sri Annapoorna Agro Industries, Omega 3 Enriched Chicken at namakkal, Omega 3 Enriched Egg at namakkal, Omega 3 Enriched Chicken at namakkal, Broiler Chicken at namakkal' });
    this.metaService.updateTag({ name: 'description', content: 'Animal protien is we can take large quantity as per our body requirement. Comparatively vegetable protiens. It will give energy for daily activities and tissue growth.This is the about page description.' });
  }

}

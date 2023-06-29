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
    this.titleService.setTitle('About us - Monster Chicken');
    this.metaService.updateTag({ name: 'keywords', content: 'Chicken, Boneless Chicken, Leg peice' });
    this.metaService.updateTag({ name: 'description', content: 'This is the about page description.' });
  }

}

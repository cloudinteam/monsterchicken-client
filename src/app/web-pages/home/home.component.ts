import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading = false;
  banners = [];
  promotionalAds = [
    {
      name: 'One',
      img: 'https://placehold.co/600x400'
    },
    {
      name: 'Two',
      img: 'https://placehold.co/600x400'
    },
    {
      name: 'Three',
      img: 'https://placehold.co/600x400'
    },
    {
      name: 'Four',
      img: 'https://placehold.co/600x400'
    }
  ]

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 3500,
    // navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    nav: false,
    dots: false,
  }

  constructor(
    private productService: ProductService,
    private titleService: Title,
    private metaService: Meta,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Monster Chicken | Buy Fresh Chicken Online | Best Price Online Raw Chicken');
    this.metaService.updateTag({ name: 'title', content: 'Monster Chicken | Buy Fresh Chicken Online | Best Price Online Raw Chicken' });
    this.metaService.updateTag({ name: 'keywords', content: 'Monsterchicken, chickenbuyonline, freshchicken, best fresh chicken, best fresh chicken online, online chicken, Chicken bulk order, bulk order, buy chicken at namakkal, best chicken in namakkal, quality chicken online, Sri Annapoorna Agro Industries, Omega 3 Enriched Chicken at namakkal, Omega 3 Enriched Egg at namakkal, Omega 3 Enriched Chicken at namakkal, Broiler Chicken at namakkal' });
    this.metaService.updateTag({ name: 'description', content: 'Animal protien is we can take large quantity as per our body requirement. Comparatively vegetable protiens. It will give energy for daily activities and tissue growth.This is the about page description.' });
    this.loadData();
  }


  loadData() {
    this.productService.getBanners().subscribe((r: any) => {
      // console.log(r);
      this.banners = r.response.banners;
    })
  }

}

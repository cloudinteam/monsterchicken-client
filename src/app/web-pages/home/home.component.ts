import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProductService } from './../../services/product.service';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';

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
  ) { }

  ngOnInit(): void {
    this.loadData();
  }


  loadData() {
    this.productService.getBanners().subscribe((r: any) => {
      // console.log(r);
      this.banners = r.response.banners;
    })
  }

}

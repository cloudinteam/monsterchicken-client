import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Event,
  Router,
} from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';
import { HeaderService } from 'src/app/services/header.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  productList: Product[] = [];
  loading = true;
  filter = {
    search: '',
  }
  notFound = false;

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private productService: ProductService,
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.headerService.disableSearch.next(true);
      }
      if (event instanceof NavigationEnd) {

      }
      if (event instanceof NavigationError) {
      }
    });

    this.headerService.searchString.subscribe((r: string) => {
      this.filter.search = r;
      if (this.filter.search != '') {
        this.getProducts();
      } else {
        this.productList = [];
      }

    })
  }

  ngOnInit(): void {
    this.loading = false;
    this.notFound = false;
    this.headerService.disableSearch.next(false);
  }

  searchFn() {
    setTimeout(() => {
      if (this.filter.search != '') {
        this.getProducts();
      } else {
        this.productList = [];
      }
    }, 1000);
  }

  getProducts() {
    this.loading = true;
    this.notFound = false;
    let latLngData: any = localStorage.getItem('lat_lng');
    let latLng = JSON.parse(latLngData)
    let data = {
      category: '',
      userLat: latLng.lat || '',
      userLong: latLng.lng || '',
      uniqTkn: localStorage.getItem('unique_token') ?? ''
    };
    // console.log(data);
    this.productService.getProducts(data.userLat, data.userLong, data.category, data.uniqTkn).subscribe((r: any) => {
    // this.productService.getProducts(this.filter).subscribe((r: any) => {
      // console.log(r);
      if (r.response.products.length == 0) {
        this.productList = [];
        this.filter.search = '';
        this.notFound = true;
      }
      this.productList = r.response.products;
      this.loading = false;
    });
  }


}

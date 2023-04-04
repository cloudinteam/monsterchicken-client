import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Event,
  Router,
} from '@angular/router';
import { Product } from 'src/app/models/product.model';
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
    this.headerService.disableSearch.next(false);

    // this.headerService.searchString.subscribe((r: string) => {
    //   this.filter.search = r;
    //   this.getProducts();
    // })
  }

  getProducts() {
    this.loading = true;
    this.productService.getProducts(this.filter).subscribe((r: any) => {
      // console.log(r);
      this.productList = r.response.products;
      this.loading = false;
    });
  }

}

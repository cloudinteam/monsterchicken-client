import { Component, OnInit } from '@angular/core';
import { AddressService } from './services/address.service';
import { CommonService } from './services/common.service';
import { ProductService } from './services/product.service';
import { Category } from './models/category.model';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ConfirmationService]
})
export class AppComponent implements OnInit {

  title = 'monster-chicken-frontend';
  categories: Category[] = [];
  loading = false;
  logggedIn = false;

  constructor(
    private addressService: AddressService,
    private commonService: CommonService,
    private productService: ProductService,
    private authService: AuthService
  ) {
    this.commonService.epicFunction();
  }

  ngOnInit(): void {

    this.logggedIn = this.authService.isLoggedIn();

    if (!this.logggedIn) {
      this.setUniqueToken();
    }

    this.loading = true;
    if (localStorage.getItem('userLat') == null || localStorage.getItem('userLong') == null) {
      this.addressService.getPosition().then((pos: any) => {
        // console.log(`Your positon: ${pos.lng} ${pos.lat}`);
      });
    }
    this.productService.getCategories().subscribe((r: any) => {
      this.categories = r.response.categories;
    })
    this.loading = false;
  }

  setUniqueToken() {
    this.commonService.getUniqueToken().subscribe((r: any) => {
      // console.log(r);
      if (localStorage.getItem('unique_token') == null) {
        localStorage.setItem('unique_token', r.response.unique_token)
      }
    })
  }

}

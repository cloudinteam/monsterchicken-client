import { Component, OnInit } from '@angular/core';
import { AddressService } from './services/address.service';
import { CommonService } from './services/common.service';
import { ProductService } from './services/product.service';
import { Category } from './models/category.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'monster-chicken-frontend';
  categories: Category[] = [];
  loading = false;

  constructor(
    private addressService: AddressService,
    private commonService: CommonService,
    private productService: ProductService,
  ) {
    this.commonService.epicFunction();
  }

  ngOnInit(): void {
    this.loading = true;
    if (localStorage.getItem('userLat') == null || localStorage.getItem('userLong') == null) {
      this.addressService.getPosition().then((pos: any) => {
        console.log(`Your positon: ${pos.lng} ${pos.lat}`);
      });
    }
    this.productService.getCategories().subscribe((r: any) => {
      this.categories = r.response.categories;
    })
    this.loading = false;
  }

}

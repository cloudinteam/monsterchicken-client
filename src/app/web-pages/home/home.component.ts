import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading = false;
  banners = [];

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

import { CartService } from 'src/app/services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  catId: string = '';
  loading = true;
  productList: Product[] = [];
  categories: any[] = [];
  selectedCategory: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
  ) {

  }

  ngOnInit(): void {

    this.route.params.subscribe((r) => {
      this.catId = this.route.snapshot.paramMap.get('id') || '';
      this.getProduct(this.catId);
    })

    this.cartService.productLoad$.subscribe((r) => {
      if (r == true) {
        this.init();
      }
    })

    // this.loading = false;
  }

  init() {
    this.loading = true;
    this.catId = this.route.snapshot.paramMap.get('id') || '';
    this.getProduct(this.catId);
  }

  getProduct(catId: any) {
    this.loading = true;
    let latLngData: any = localStorage.getItem('lat_lng');
    let latLng = JSON.parse(latLngData)
    let data = {
      category: catId,
      userLat: latLng.lat || '',
      userLong: latLng.lng || '',
      uniqTkn: localStorage.getItem('unique_token') ?? ''
    };
    // console.log(data);
    this.productService.getProducts(data.userLat, data.userLong, data.category, data.uniqTkn).subscribe((r: any) => {
      // console.log(r);
      this.productList = r.response.products;
      this.categories = r.response.categories;
      const index = this.categories.findIndex( (category: any) => {
        return category.selected === true;
      });
      this.selectedCategory = this.categories[index].category;
      this.loading = false;
    });
  }

}

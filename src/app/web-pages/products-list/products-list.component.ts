import { CartService } from 'src/app/services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  catId: string = '';
  loading = true;
  productList: Product[] = [];
  categories = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private alert: AlertService
  ) {

  }

  ngOnInit(): void {

    this.loading = true;

    this.catId = this.route.snapshot.paramMap.get('id') || '';
    this.getProduct(this.catId);
    // this.loading = false;
  }

  getProduct(catId: any) {
    let data = { category: catId };
    this.productService.getProducts(data).subscribe((r: any) => {
      this.productList = r.response.products;
      this.categories = r.response.categories;
      this.loading = false;
    });
  }

  // addWishList(id: any) {
  //   let data = { productId: id };
  //   this.cs.addWishList(data).subscribe((r: any) => {
  //     this.alert.fireToastS(r.message[0]);
  //   });
  // }

  addCart(id: any) {
    let data = { productId: id };
    this.cartService.addCart(data).subscribe((r: any) => {
      this.alert.fireToastS(r.message[0]);
      this.cartService.addCartCount();
    });
  }

  viewProduct(id: string) {
    this.router.navigate(['/product/' + id]);
  }

  viewCat(id: string) {
    this.router.navigate(['/category/' + id]);
  }

}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit {
  loading = false;
  productId: string = '';
  product!: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private cdRef: ChangeDetectorRef,
    private alert: AlertService,
  ) {}

  ngOnInit(): void {

    this.cartService.productLoad$.subscribe((r) => {
      if (r == true) {
        this.init();
      } else {
        this.init();
      }
    })


  }

  init() {
    this.loading = true;
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.getProduct(this.productId);
  }

  getProduct(id: string) {
    let data = { productId: id };
    this.productService.viewProduct(data).subscribe((r: any) => {
      // console.debug(r);
      this.product = r.response.productDetail;
      this.loading = false;
    });
  }

  goToHome() {

  }

  goToCategory(catId: number) {

  }

  addCart(id: any) {
    this.loading = true;
    let data = { productId: id };
    this.cartService.addCart(data).subscribe((r: any) => {
      this.cartService.addCartCount();
      this.alert.fireToastS('Prooduct added to cart');
      this.afterCart(id);
      this.loading = false;
    });
  }

  cartNumber($event: any, id: string) {
    let data = {
      productId: id,
      quantity: $event.value
    };
    this.cartService.addCart(data).subscribe((r: any) => {
      this.cartService.addCartCount();
      this.afterCart(id);
      this.loading = false;
    });

  }

  afterCart(id: any) {
    let data = { productId: id };
    this.productService.viewProduct(data).subscribe((r: any) => {
      this.product = r.response.productDetail;
      this.cdRef.markForCheck();
    });
  }
}

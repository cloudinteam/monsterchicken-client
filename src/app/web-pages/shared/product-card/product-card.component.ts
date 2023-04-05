import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {

  @Input() product!: Product;
  @Output() loaded: EventEmitter<any> = new EventEmitter();

  loading = false;
  cartQuantity: number = 0;
  cartProductCount: number = 0;

  constructor(
    private cartService: CartService,
    private alert: AlertService,
    private router: Router,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef,
  ) {

  }

  addCart(id: any) {
    this.loading = true;
    let data = { productId: id };
    this.cartService.addCart(data).subscribe((r: any) => {
      this.cartService.addCartCount();
      this.alert.fireToastS(r.message[0]);
      // this.loaded.emit();
      this.afterCart(id);
      this.loading = false;
    });
  }

  afterCart(id: any) {
    let data = { productId: id };
    this.productService.viewProduct(data).subscribe((r: any) => {
      // console.log(r.response.productDetail);
      this.product = r.response.productDetail;
      this.cdRef.markForCheck();
      // this.loading = false;
      // this.productDetails = r.response.productDetail;
    });
  }

  viewProduct(id: string) {
    this.router.navigate(['/product/' + id]);
  }

  viewCat(id: string) {
    this.router.navigate(['/category/' + id]);
  }

  cartNumber($event: any, id: string) {
    // console.log($event.value, id);

    this.loading = true;
    let data = {
      productId: id,
      quantity: $event.value
    };
    this.cartService.addCart(data).subscribe((r: any) => {
      this.cartService.addCartCount();
      this.alert.fireToastS(r.message[0]);
      // this.loaded.emit();
      this.afterCart(id);
      this.loading = false;
    });

  }

}

import { AuthService } from 'src/app/services/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss']
})
export class CartProductComponent implements OnInit {

  @Input() cartItem: any;
  @Input() itemNo: number = 1;
  @Output() update: EventEmitter<any> = new EventEmitter();

  disableAdd = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {

  }

  cartNumber($event: any, cartItem: Product, cartId: string) {
    this.disableAdd = true;
    if (this.authService.isLoggedIn()) {
      let data = [{
        cartId: cartId,
        productId: cartItem.product_id,
        quantity: $event.value,
        nearByBranch: cartItem.near_by_branch,
      }];
      this.cartService.addCart({ carts: data }).subscribe((r: any) => {
        this.disableAdd = false;
        this.update.emit();
      });
    }
  }

  removeItem(productId: string) {
    if (this.authService.isLoggedIn()) {
      let data = [{
        productId: productId,

        status: 'remove'
      }];
      this.cartService.addCart({ carts: data }).subscribe((r: any) => {
        this.update.emit();
      });
    }
  }


}

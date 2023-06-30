import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'cart-page-product',
  templateUrl: './cart-page-product.component.html',
  styleUrls: ['./cart-page-product.component.scss']
})
export class CartPageProductComponent {

  @Input() cartItem: any;
  @Input() itemNo: number = 1;
  @Output() update: EventEmitter<any> = new EventEmitter();

  disableAdd = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
  ) { }

  cartNumber($event: any, cartItem: any, cartId: string) {
    this.disableAdd = true;

    let data = {
      product_id: cartItem.product.product_id,
      branch_user_id: cartItem.branch_user.user_id,
      quantity: ($event.value > 0) ? $event.value : ($event.value <= 0) ?? 1,
      unique_token: this.cartService.uniqueToken
    }
    this.cartService.updateCart(data, cartId).subscribe((r: any) => {
      this.disableAdd = false;
      this.update.emit();
    });
  }

  removeItem(cartId: string) {
    this.cartService.deleteCart(cartId).subscribe((r: any) => {
        this.update.emit();
    });
  }

}

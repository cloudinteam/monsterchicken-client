import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { LocalcartService } from 'src/app/services/localcart.service';

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
    private localCartService: LocalcartService,
  ) { }

  cartNumber($event: any, cartItem: Product, cartId: string) {
    this.disableAdd = true;
    console.log($event.value);



    if (this.authService.isLoggedIn()) {
      if ($event.value == null) {
        this.cartItem.quantity = 1;
      }
      let data = [{
        cartId: cartId,
        product_id: cartItem.product_id,
        quantity: ($event.value == null) ? 1 : $event.value,
        near_by_branch: cartItem.near_by_branch,
      }];
      this.cartService.addCart({ carts: data }).subscribe((r: any) => {
        this.disableAdd = false;
        this.update.emit();
      });
    } else if (!this.authService.isLoggedIn()) {
      if ($event.value == null) {
        this.cartItem.quantity = 1;
      }
      let localCart = this.localCartService.getLocalCart

      const index = localCart.findIndex( (cart: any) => {
        return cart.product_id === cartItem.product_id;
      });

      if ($event.value != 0) {
        localCart[index].quantity = ($event.value == null) ? 1 : $event.value;
        localCart[index].totalPrice = $event.value * localCart[index].price;
      } else {
        localCart.splice(index, 1);
      }

      if (localCart.length > 0) {
        localStorage.setItem('localCart', JSON.stringify(localCart));
      } else {
        localStorage.removeItem('localCart');
      }

      this.localCartService.setCartTotal();
      this.disableAdd = false;
      this.update.emit();
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
    } else if (!this.authService.isLoggedIn()) {

      if (localStorage.getItem('localCart') != null) {
        let localCart = this.localCartService.getLocalCart
        const index = localCart.findIndex((cart: any) => {
          return cart.productId === productId;
        });
        localCart.splice(index, 1);
        if (localCart.length > 0) {
          localStorage.setItem('localCart', JSON.stringify(localCart));
        } else {
          localStorage.removeItem('localCart');
        }
      }

      this.localCartService.setCartTotal();
      this.update.emit();
    }
  }

}

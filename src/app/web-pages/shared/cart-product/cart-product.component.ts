import { AuthService } from 'src/app/services/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { LocalcartService } from 'src/app/services/localcart.service';

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
    private localCartService: LocalcartService,
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
    } else if (!this.authService.isLoggedIn()) {
      let localCart = this.localCartService.getLocalCart

      const index = localCart.findIndex( (cart: any) => {
        return cart.productId === cartItem.product_id;
      });

      if ($event.value != 0) {
        localCart[index].quantity = $event.value;
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
      let localCart = this.localCartService.getLocalCart
      const index = localCart.findIndex( (cart: any) => {
        return cart.productId === productId;
      });
      localCart.splice(index, 1);
      if (localCart.length > 0) {
        localStorage.setItem('localCart', JSON.stringify(localCart));
      } else {
        localStorage.removeItem('localCart');
      }
      this.localCartService.setCartTotal();
      this.update.emit();
    }
  }


}

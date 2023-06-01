import { Injectable } from '@angular/core';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class LocalcartService {

  constructor(
    private cartService: CartService,

  ) { }

  get getLocalCart() {
    let prevCart: any = localStorage.getItem('localCart');
    return JSON.parse(prevCart);
  }

  get getCartGrandTotal() {
    if (localStorage.getItem('localCart') !== null) {
      let prevCart: any = localStorage.getItem('localCart');
      let total: number = 0;
      JSON.parse(prevCart).forEach((cartItem: any) => {
        total = total + (cartItem.totalPrice * cartItem.quantity);
      });
      return total;
    } else {
      return 0;
    }
  }

  pushLocalCartToLive() {
    // Update Local_Cart to DB
    if (localStorage.getItem('localCart') != null) {
      if (this.getLocalCart.length > 0) {
        let localCart: any[] = [];
        this.cartService.addCart({ carts: this.getLocalCart }).subscribe((r: any) => {
          this.cartService.addCartCount();
          localStorage.removeItem('localCart');
        });
      }
    }
  }

  setCartTotal() {
    if (localStorage.getItem('localCart') !== null) {
      let cartData: any = localStorage.getItem('localCart');
      let localCart = JSON.parse(cartData)

      let totalCount = localCart.length;
      let totalCartPrice: number = 0;

      this.cartService.cartCount.next({ count: totalCount, total: this.getCartGrandTotal });
    } else {
      this.cartService.cartCount.next({ count: 0, total: 0 });
    }
  }

}

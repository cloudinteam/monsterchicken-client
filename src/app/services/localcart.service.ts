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
      console.log(prevCart);

      let total: number = 0;
      JSON.parse(prevCart).forEach((cartItem: any) => {
        total = total + (cartItem.price * cartItem.quantity);
      });
      console.log(total);
      return total;
    } else {
      return 0;
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

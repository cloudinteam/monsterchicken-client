import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // cartCount: number = 0;
  cartProducts: any[] = [];

  private _cartCount = {count:0, total: 0};
  public cartCount: BehaviorSubject<any> = new BehaviorSubject<any>(this._cartCount);

  private _productLoad: boolean = false;
  public productLoad$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._productLoad);

  constructor(
    private api: ApiCallService,
    private authService: AuthService,
  ) { }

  get uniqueToken() {
    let token: any = localStorage.getItem('unique_token');
    // console.log(token);
    return token;
  }

  getCart() {
    return this.api.getApiCallAuth(NetworkService.getCart()+'?unique_token='+this.uniqueToken);
  }

  addCart(body: any): any {
    return this.api.postApiCallAuth(NetworkService.addToCart(), body);
  }

  updateCart(body: any, cartId: string): any {
    return this.api.putApiCallAuth(NetworkService.updateCart()+'/'+cartId, body);
  }

  deleteCart(cartId: string) {
    return this.api.deleteApiCallAuth(NetworkService.deleteCart()+'/'+cartId);
  }

  getCartCount() {
    return this.cartCount;
  }

  putCartCount(count: any) {
    this.cartCount = count;
  }

  addCartCount() {
    this.getCart().subscribe((r: any) => {
      this._cartCount.count = r.response.data.total_cart_count;
      this._cartCount.total = r.response.data.total_cart_price;
      this.cartCount.next(this._cartCount);
    })

  }

  reduceCartCount() {
    this.getCart().subscribe((r: any) => {
      this._cartCount.count = r.response.data.total_cart_count;
      this._cartCount.total = r.response.data.total_cart_price;
      this.cartCount.next(this._cartCount);
    })
  }
  setCartProducts(products: any) {
    this.cartProducts = products;
  }

  getCartProducts() {
    return this.cartProducts;
  }

}

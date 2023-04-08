import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';
import { BehaviorSubject, Observable } from 'rxjs';

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
    private api: ApiCallService
  ) { }

  getCart(body: any): any {
    return this.api.postApiCallAuth(NetworkService.getCart(), body);
  }

  addCart(body: any): any {
    return this.api.postApiCallAuth(NetworkService.addToCart(), body);
  }

  getCartCount() {
    return this.cartCount;
  }

  putCartCount(count: any) {
    this.cartCount = count;
  }

  addCartCount() {
    this.getCart({}).subscribe((r: any) => {

      this._cartCount.count = r.response.cart.length;
      this._cartCount.total = r.response.totalCartPrice;
      this.cartCount.next(this._cartCount);


    })
  }

  reduceCartCount() {
    this.getCart({}).subscribe((r: any) => {
      this._cartCount.count = r.response.cart.length;
      this._cartCount.total = r.response.totalCartPrice;
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

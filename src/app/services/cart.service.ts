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

  private _cartCount: number = 0;
  public cartCount: BehaviorSubject<number> = new BehaviorSubject<number>(this._cartCount);

  private _count: any = 0;
  public count$ = new Observable<any>(this._count);

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

      this._cartCount = r.response.cart.length;
      this.cartCount.next(this._cartCount);

    })
  }

  reduceCartCount() {
    this.getCart({}).subscribe((r: any) => {
      this._cartCount = r.response.cart.length;
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

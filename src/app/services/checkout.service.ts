import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private api: ApiCallService
  ) { }

  promoCode(data: any) {
    return this.api.getApiCallAuth(NetworkService.promoCode(data));
  }

  cartSummary(): any {
    return this.api.getApiCallAuth(NetworkService.getCartSummary())
  }

  cartCheckout(body: any): any {
    return this.api.postApiCallAuth(NetworkService.cartCheckout(), body);
  }

  payment(body: any): any {
    return this.api.postApiCallAuth(NetworkService.payment(), body);
  }

}

import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private api: ApiCallService
  ) { }

  getCheckout(body: any): any {
    return this.api.postApiCallAuth(NetworkService.getCheckout(), body);
  }

  cartCheckout(body: any): any {
    return this.api.postApiCallAuth(NetworkService.cartCheckout(), body);
  }

  payment(body: any): any {
    return this.api.postApiCallAuth(NetworkService.payment(), body);
  }

}

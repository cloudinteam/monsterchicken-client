import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private api: ApiCallService,
    private http: HttpClient,
    private messageService: MessageService,
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

  payment(body: any, orderId: string): any {
    return this.api.postApiCallAuth(NetworkService.payment(orderId), body);
  }

  onlinePayment(body: any): Observable<any> {
    return this.http.post<any>('https://sandbox-icp-api.bankopen.co/api/payment_token', body, {
      // headers: NetworkService.getAuthHeader(),
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer d82a5fe0-6671-11ee-a5bf-9fc783d04255:2d27e0ccd0c10a569fe04f62d13357b7bf8b0102'
      }
      })
      .pipe(
        map((r: any) => {
          console.log(r);
          if (r.status) {
            return r;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Data fetched'
            })
            return r;
          }
        }),
        catchError((err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error'
          })
          return '';
        })
    );
  }

}

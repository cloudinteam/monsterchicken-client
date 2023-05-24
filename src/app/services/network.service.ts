import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Consts } from '../utils/consts';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor() {}

  static server_url(): string {
    return Consts.URL();
  }

  static server_v(): string {
    return '/api/v1.0';
  }

  static getAuthHeader(): HttpHeaders {
    let header = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.authToken(),
      deviceId: this.hash(),
    }).set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return header;
  }

  static getHeader(): HttpHeaders {
    let header = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return header;
  }

  static authToken(): any {
    return localStorage.getItem('accessToken') || undefined;
  }
  static hash(): any {
    return localStorage.getItem('_h_key') || undefined;
  }

  // Authentication
  static login(): string {
    return this.server_url() + this.server_v() + '/login';
  }
  static verifyNumber(): string {
    return this.server_url() + this.server_v() + '/web/login/number-verify';
  }
  static verifyOtp(): string {
    return this.server_url() + this.server_v() + '/web/login/otp-verify';
  }
  static resendOtp(): string {
    return this.server_url() + this.server_v() + '/web/login/resend-otp';
  }
  static Signup(): string {
    return this.server_url() + this.server_v() + '/register';
  }
  static forgotPassword(): string {
    return this.server_url() + this.server_v() + '/forget-password';
  }
  static ChangePassword(): string {
    return this.server_url() + this.server_v() + '/change-password';
  }
  static SetPassword(): string {
    return this.server_url() + this.server_v() + '/update-password';
  }
  static profile(): string {
    return this.server_url() + this.server_v() + '/web/profile';
  }
  static profileEdit(): string {
    return this.server_url() + this.server_v() + '/web/profile-update';
  }

  //Products
  static getProducts(): string {
    return this.server_url() + this.server_v() + '/web/product/list';
  }
  static viewProduct(): string {
    return this.server_url() + this.server_v() + '/web/product/view';
  }
  static getCategory(): string {
    return this.server_url() + this.server_v() + '/web/product/category/list';
  }
  static getSubCat(): string {
    return this.server_url() + this.server_v() + '/login';
  }
  static getBanners(): string {
    return this.server_url() + this.server_v() + '/web/banner/list';
  }
  static getProductOptions(): string {
    return this.server_url() + this.server_v() + '/web/product/get-product';
  }
  static getCategoryOptions(): string {
    return this.server_url() + this.server_v() + '/web/product/get-product-category';
  }

  //Order History
  static getOrderHistory(): string {
    return this.server_url() + this.server_v() + '/web/order-history';
  }
  static getOrderInvoice(id: string): string {
    return this.server_url() + '/api/admin/order/'+ id +'/generate-pdf';
  }
  static getOrderDetail(id: string): string {
    return this.server_url() + this.server_v()+ '/web/order-history/' + id;
  }


  //cart
  static addToCart(): string {
    return this.server_url() + this.server_v() + '/web/cart/store';
  }
  static viewCart(): string {
    return this.server_url() + this.server_v() + '/web/cart/list';
  }
  static getCart(): string {
    return this.server_url() + this.server_v() + '/web/cart/list';
  }


  //Checkout
  static getCartSummary(): string {
    return this.server_url() + this.server_v() + '/web/cart/summary';
  }
  static cartCheckout(): string {
    return this.server_url() + this.server_v() + '/web/cart/checkout';
  }
  static payment(): string {
    return this.server_url() + this.server_v() + '/payment';
  }
  static promoCode(): string {
    return this.server_url() + this.server_v() + '/web/check-promo-code';
  }



  // Location Check
  static locationCheck(): string {
    return this.server_url() + this.server_v() + '/web/location-checking';
  }
  static storeAdddress(): string {
    return this.server_url() + this.server_v() + '/web/address/store';
  }
  static listAdddress(): string {
    return this.server_url() + this.server_v() + '/web/address/list';
  }
  static viewAdddress(): string {
    return this.server_url() + this.server_v() + '/web/address/view';
  }
  static deleteAdddress(): string {
    return this.server_url() + this.server_v() + '/web/address/delete';
  }
  static setDefault(): string {
    return this.server_url() + this.server_v() + '/web/address/default';
  }
  static getActiveCities(): string {
    return this.server_url() + this.server_v() + '/get-all-active-cities';
  }

  //File upload
  static upload(): string {
    return this.server_url() + "/api/admin" + "/file/upload";
  }

  static getState(): string {
    return this.server_url() + this.server_v() + '/state/list';
  }

  static getCountry(): string {
    return this.server_url() + this.server_v() + '/country/list';
  }

  static getCity(): string {
    return this.server_url() + this.server_v() + '/city/list';
  }

  static getDistrict(): string {
    return this.server_url() + this.server_v() + '/district/list';
  }

  static bulkOrderSubmit(): string {
    return this.server_url() + this.server_v() + '/bulkOrder/store';
  }

  // Notification
  static notificationList(): string {
    return this.server_url() + this.server_v() + '/notification/my-notifications';
  }
  static notificationUpdate(id: string): string {
    return this.server_url() + this.server_v() + '/notification/update/'+id;
  }
}

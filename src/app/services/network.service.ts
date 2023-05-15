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
    return this.server_url() + this.server_v() + '/login/number-verify';
  }
  static verifyOtp(): string {
    return this.server_url() + this.server_v() + '/login/otp-verify';
  }
  static resendOtp(): string {
    return this.server_url() + this.server_v() + '/login/resend-otp';
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
  static logout(): string {
    return this.server_url() + this.server_v() + '/login';
  }
  static profile(): string {
    return this.server_url() + this.server_v() + '/profile';
  }
  static profileEdit(): string {
    return this.server_url() + this.server_v() + '/profile-update';
  }

  //Products
  static getProducts(): string {
    return this.server_url() + this.server_v() + '/web/product/list';
  }
  static viewProduct(): string {
    return this.server_url() + this.server_v() + '/product/view';
  }
  static getCategory(): string {
    return this.server_url() + this.server_v() + '/product/category/list';
  }
  static getSubCat(): string {
    return this.server_url() + this.server_v() + '/login';
  }
  static getBanners(): string {
    return this.server_url() + this.server_v() + '/banner/list';
  }
  static getProductOptions(): string {
    return this.server_url() + this.server_v() + '/product/get-product';
  }
  static getCategoryOptions(): string {
    return this.server_url() + this.server_v() + '/product/get-product-category';
  }

  //Order History
  static getOrderHistory(): string {
    return this.server_url() + this.server_v() + '/order-history';
  }
  static getOrderInvoice(id: string): string {
    return this.server_url() + '/api/admin/order/'+ id +'/generate-pdf';
  }
  static getOrderDetail(id: string): string {
    return this.server_url() + this.server_v()+ '/order-history/' + id;
  }


  //cart
  static addToCart(): string {
    return this.server_url() + this.server_v() + '/web/cart/store';
  }
  static clearCart(): string {
    return this.server_url() + this.server_v() + '/login';
  }
  static viewCart(): string {
    return this.server_url() + this.server_v() + '/cart/list';
  }
  static getCart(): string {
    return this.server_url() + this.server_v() + '/web/cart/list';
  }


  //Checkout
  static getCheckout(): string {
    return this.server_url() + this.server_v() + '/checkout/data';
  }
  static cartCheckout(): string {
    return this.server_url() + this.server_v() + '/cart/checkout';
  }
  static payment(): string {
    return this.server_url() + this.server_v() + '/payment';
  }



  // Location Check
  static locationCheck(): string {
    return this.server_url() + this.server_v() + '/web/location-checking';
  }
  static storeAdddress(): string {
    return this.server_url() + this.server_v() + '/address/store';
  }
  static listAdddress(): string {
    return this.server_url() + this.server_v() + '/address/list';
  }
  static viewAdddress(): string {
    return this.server_url() + this.server_v() + '/address/view';
  }
  static deleteAdddress(): string {
    return this.server_url() + this.server_v() + '/address/delete';
  }
  static setDefault(): string {
    return this.server_url() + this.server_v() + '/address/default';
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

  static getBulkOrder(): string {
    return this.server_url() + this.server_v() + '/bulkOrder/category-list';
  }

  static bulkOrderSubmit(): string {
    return this.server_url() + this.server_v() + '/bulkOrder/store';
  }
}

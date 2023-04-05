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
      // deviceKey: this.hash(),
    });
    return header;
  }

  static getHeader(): HttpHeaders {
    let header = new HttpHeaders();
    return header;
  }

  static authToken(): any {
    return localStorage.getItem('accessToken') || undefined;
  }

  // Authentication
  static login(): string {
    return this.server_url() + this.server_v() + '/login';
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
  static resendOTP(): string {
    return this.server_url() + this.server_v() + '/resend-otp';
  }
  static logout(): string {
    return this.server_url() + this.server_v() + '/login';
  }

  //Products
  static getProducts(): string {
    return this.server_url() + this.server_v() + '/product/list';
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

  //cart
  static addToCart(): string {
    return this.server_url() + this.server_v() + '/cart/store';
  }
  static clearCart(): string {
    return this.server_url() + this.server_v() + '/login';
  }
  static viewCart(): string {
    return this.server_url() + this.server_v() + '/cart/list';
  }
  static getCart(): string {
    return this.server_url() + this.server_v() + '/cart/list';
  }

}

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
      // .set('Access-Control-Allow-Origin', 'http://localhost:4200/')
      // .set('Access-Control-Allow-Origin', 'https://monsterchicken-client-test.vercel.app/')
      // .set('Access-Control-Allow-Origin', 'https://api.test.monsterchicken.cloudinworks.com/');

    return header;
  }

  static getHeader(): HttpHeaders {
    let header = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
      //.set('Access-Control-Allow-Origin', 'http://localhost:4200/')
      //.set('Access-Control-Allow-Origin', 'https://monsterchicken-client-test.vercel.app/')
      //.set('Access-Control-Allow-Origin', 'https://api.test.monsterchicken.cloudinworks.com/');
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
    return this.server_url() + this.server_v() + '/mc-web/login-with-otp';
  }
  static verifyOtp(): string {
    return this.server_url() + this.server_v() + '/mc-web/login/otp-verify';
  }
  static resendOtp(): string {
    return this.server_url() + this.server_v() + '/mc-web/login/resend-otp';
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
  static getUniqueToken(): string {
    return this.server_url() + this.server_v() + '/mc-web/get-unique-token';
  }

  //Products
  // static getProducts(): string {
  //   return this.server_url() + this.server_v() + '/web/product/list';
  // }
  static getProducts(): string {
    return this.server_url() + this.server_v() + '/mc-web/products';
  }
  static getRelatedProducts(): string {
    return this.server_url() + this.server_v() + '/mc-web/get-related-product';
  }
  static viewProduct(): string {
    return this.server_url() + this.server_v() + '/mc-web/product';
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
  static getBulkProductOptions(): string {
    return this.server_url() + this.server_v() + '/mc-web/products/bulk_order_product';
  }
  static getCategoryOptions(): string {
    return this.server_url() + this.server_v() + '/web/product/get-product-category';
  }
  static getBranches(id: any): string {
    return this.server_url() + this.server_v() + '/mc-web/place-we-serve/'+id;
  }

  //Order History
  static getOrderHistory(): string {
    return this.server_url() + this.server_v() + '/web/order-history';
  }
  static getOrderInvoice(id: string): string {
    return this.server_url() + this.server_v() + '/mc-web/order/'+ id +'/invoice';
  }
  static getOrderDetail(id: string): string {
    return this.server_url() + this.server_v()+ '/web/order-history/' + id;
  }


  //cart
  static addToCart(): string {
    return this.server_url() + this.server_v() + '/mc-web/cart';
  }
  static updateCart(): string {
    return this.server_url() + this.server_v() + '/mc-web/cart';
  }
  static deleteCart(): string {
    return this.server_url() + this.server_v() + '/mc-web/cart';
  }
  static viewCart(): string {
    return this.server_url() + this.server_v() + '/web/cart/list';
  }
  static getCart(): string {
    return this.server_url() + this.server_v() + '/mc-web/cart';
  }


  //Checkout
  static getCartSummary(): string {
    return this.server_url() + this.server_v() + '/mc-web/cart-summary';
  }
  static cartCheckout(): string {
    return this.server_url() + this.server_v() + '/mc-web/cart-checkout';
  }
  static payment(orderId: string): string {
    return this.server_url() + this.server_v() + '/mc-web/payment/'+orderId;
  }
  static promoCode(data: any): string {
    return this.server_url() + this.server_v() + '/mc-web/check-promo-code?promo_code='+data.promo_code+'&sub_total='+data.sub_total;
  }



  // Location Check
  static locationCheck(): string {
    return this.server_url() + this.server_v() + '/web/location-checking';
  }
  static checkServiceAvailablity(): string {
    return this.server_url() + this.server_v() + '/mc-web/check-service-availability';
  }
  static storeAdddress(): string {
    return this.server_url() + this.server_v() + '/mc-web/address';
  }
  static listAdddress(): string {
    return this.server_url() + this.server_v() + '/mc-web/address';
  }
  static viewAdddress(): string {
    return this.server_url() + this.server_v() + '/mc-web/address';
  }
  static updateAdddress(): string {
    return this.server_url() + this.server_v() + '/mc-web/address';
  }
  static deleteAdddress(addressId: string): string {
    return this.server_url() + this.server_v() + '/mc-web/address/'+addressId;
  }
  static setDefault(address_id: string): string {
    return this.server_url() + this.server_v() + '/mc-web/address/'+address_id+'/set-default-address';
  }
  static getActiveCities(): string {
    return this.server_url() + this.server_v() + '/mc-web/place-we-serve';
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
    return this.server_url() + this.server_v() + '/mc-web/notification/my-notifications';
  }
  static notificationUpdate(id: string): string {
    return this.server_url() + this.server_v() + '/mc-web/notification/update/'+id;
  }

  // Forms
  static submitContactForm(): string {
    return this.server_url() + this.server_v() + '/web/contact-us/store';
  }
  static submitFranchiseForm(): string {
    return this.server_url() + this.server_v() + '/web/become-a-franchies/store';
  }
  static submitCareerForm(): string {
    return this.server_url() + this.server_v() + '/web/career/store';
  }

}

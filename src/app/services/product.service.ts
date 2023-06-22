import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private api: ApiCallService,
  ) { }

  // getProducts(body: any): any {
  //   return this.api.postApiCallAuth(NetworkService.getProducts(), body);
  // }

  getProducts(lat: number, lng: number, catId: string = '', uniqTkn: string = ''): any {
    return this.api.getApiCallAuth(NetworkService.getProducts()+'?user_latitude='+lat+'&user_longitude='+lng+'&product_category_id='+catId+'&unique_token='+uniqTkn);
  }

  getRelatedProducts(body: any): any {
    return this.api.postApiCallAuth(NetworkService.getRelatedProducts(), body);
  }

  viewProduct(body: any): any {
    return this.api.postApiCallAuth(NetworkService.viewProduct(), body);
  }

  getCategories(): any {
    return this.api.getApiCallAuth(NetworkService.getCategory());
  }

  getSubCategories(body: any): any {
    return this.api.postApiCallAuth(NetworkService.getSubCat(), body);
  }

  getBanners(): any {
    return this.api.getApiCallAuth(NetworkService.getBanners());
  }

  getBranches(id: any): any {
    return this.api.getApiCallAuth(NetworkService.getBranches(id));
  }

  // search(body: any): any {
  //   return this.api.postApiCallAuth(NetworkService.search(), body);
  // }

  // dashboard(body: any): any {
  //   return this.api.postApiCallAuth(NetworkService.dashboard(), body);
  // }


  getCategoryOptions(body: any): any {
    return this.api.postApiCallAuth(NetworkService.getCategoryOptions(), body);
  }

  bulkOrderSubmit(data: any) {
    return this.api.postApiCallAuth(NetworkService.bulkOrderSubmit(), data);
  }

  getProductOptions(body: any): any {
    return this.api.postApiCallAuth(NetworkService.getProductOptions(), body);
  }

  getOrderHistory() {
    return this.api.getApiCallAuth(NetworkService.getOrderHistory());
  }

  getOrderInvoice(id: string): string {
    // return this.api.getApiCallAuth(NetworkService.getOrderInvoice(id));
    return NetworkService.getOrderInvoice(id)
  }

  // getOrderDetail(id: string) {
  //   return this.api.postApiCallAuth(NetworkService.getOrderDetail(id), {orderId: id});
  // }

  getOrderDetail(id: string) {
    return this.api.getApiCallAuth(NetworkService.getOrderDetail(id));
  }

}

import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private api: ApiCallService
  ) { }

  getProducts(body: any): any {
    return this.api.postApiCallAuth(NetworkService.getProducts(), body);
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

  getBanners(body: any): any {
    return this.api.postApiCallAuth(NetworkService.getBanners(), body);
  }

  // search(body: any): any {
  //   return this.api.postApiCallAuth(NetworkService.search(), body);
  // }

  // dashboard(body: any): any {
  //   return this.api.postApiCallAuth(NetworkService.dashboard(), body);
  // }

  getBulkOrder() {
    return this.api.getApiCallAuth(NetworkService.getBulkOrder());
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


}

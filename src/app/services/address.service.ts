import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(
    private api: ApiCallService
  ) { }

  storeAdddress(body: any): any {
    return this.api.postApiCallAuth(NetworkService.storeAdddress(), body);
  }

}

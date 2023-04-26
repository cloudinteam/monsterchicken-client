import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private _updateAddress: any = {};
  public updateAddress: BehaviorSubject<any> = new BehaviorSubject<any>(this._updateAddress);

  constructor(
    private api: ApiCallService
  ) { }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
          localStorage.setItem('userLat', resp.coords.latitude.toString());
          localStorage.setItem('userLong', resp.coords.longitude.toString());
        },
        (err) => {
          // reject(err);
          console.error(err);
          if (err.code == 1) {
            localStorage.removeItem('userLat');
            localStorage.removeItem('userLong');
          }
        }
      );
    });
  }

  storeAdddress(body: any): any {
    return this.api.postApiCallAuth(NetworkService.storeAdddress(), body);
  }

  listAddress(body: any): any {
    return this.api.postApiCallAuth(NetworkService.listAdddress(), body);
  }

  deleteAddress(body: any): any {
    return this.api.postApiCallAuth(NetworkService.deleteAdddress(), body);
  }

}

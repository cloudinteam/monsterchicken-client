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
          reject(err);
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

  listAddress() {
    return this.api.getApiCallAuth(NetworkService.listAdddress());
  }

  viewAddress(addressId: string): any {
    return this.api.getApiCallAuth(NetworkService.viewAdddress()+'/'+addressId+'/edit');
  }

  putAddress(body: any): any {
    return this.api.putApiCallAuth(NetworkService.updateAdddress() + '/' + body.address_id, body);
  }

  deleteAddress(addressId: string) {
    return this.api.deleteApiCallAuth(NetworkService.deleteAdddress(addressId));
  }

  setDefault(body: any): any {
    return this.api.putApiCallAuth(NetworkService.setDefault(body.address_id), body);
  }

}

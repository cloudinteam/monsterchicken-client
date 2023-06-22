import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(
    private api: ApiCallService
  ) { }


  locationCheck(body: any): any {
    return this.api.postApiCallAuth(NetworkService.locationCheck(), body);
  }

  checkServiceAvailablity(lat: number, lng: number) {
    return this.api.getApiCallAuth(NetworkService.checkServiceAvailablity()+"?latitude="+lat+"&longitude="+lng);
  }

  getActiveCities() {
    return this.api.getApiCallAuth(NetworkService.getActiveCities());
  }

}

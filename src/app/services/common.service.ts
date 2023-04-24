import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private api: ApiCallService
  ) { }

  upload(data: any) {
    return this.api.postApiCallAuthNEE(NetworkService.upload(), data);
  }

}

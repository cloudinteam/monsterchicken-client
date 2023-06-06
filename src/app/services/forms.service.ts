import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(
    private api: ApiCallService,
  ) { }

  submitContactForm(body: any): any {
    return this.api.postApiCallAuth(NetworkService.submitContactForm(), body);
  }

  submitFranchiseForm(body: any): any {
    return this.api.postApiCallAuth(NetworkService.submitFranchiseForm(), body);
  }

  submitCareerForm(body: any): any {
    return this.api.postApiCallAuth(NetworkService.submitCareerForm(), body);
  }

}

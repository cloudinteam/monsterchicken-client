import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private api: ApiCallService
  ) { }

  login(body: any): any {
    return this.api.postApiCallAuth(NetworkService.login(), body);
  }

  verifyNumber(body: any): any {
    return this.api.postApiCallAuth(NetworkService.verifyNumber(), body);
  }

  signup(body: any): any {
    return this.api.postApiCallAuth(NetworkService.Signup(), body);
  }
  forgotPassword(body: any): any {
    return this.api.postApiCallAuth(NetworkService.forgotPassword(), body);
  }

  setPassword(body: any): any {
    return this.api.postApiCallAuth(NetworkService.SetPassword(), body);
  }

  updatePassword(body: any): any {
    return this.api.postApiCallAuth(NetworkService.ChangePassword(), body);
  }

  resendOTP(body: any): any {
    return this.api.postApiCallAuth(NetworkService.resendOTP(), body);
  }

  logout(): any {
    // return this.api.postApiCallAuth(NetworkService.logout(), body);
    localStorage.clear();
    sessionStorage.clear();
  }

  isLoggedIn() {
    if ( localStorage.getItem('accessToken') == undefined || localStorage.getItem('accessToken') == '' ) {
      return false;
    }
    else {
      return true;
    }
  }

}

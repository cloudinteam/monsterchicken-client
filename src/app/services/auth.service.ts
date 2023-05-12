import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private api: ApiCallService,
    private router: Router,
  ) { }

  login(body: any): any {
    return this.api.postApiCallAuth(NetworkService.login(), body);
  }

  verifyNumber(body: any): any {
    return this.api.postApiCallAuth(NetworkService.verifyNumber(), body);
  }

  verifyOtp(body: any): any {
    return this.api.postApiCallAuth(NetworkService.verifyOtp(), body);
  }

  resendOtp(body: any): any {
    return this.api.postApiCallAuth(NetworkService.resendOtp(), body);
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
    return this.api.postApiCallAuth(NetworkService.resendOtp(), body);
  }

  profile(body: any): any {
    return this.api.postApiCallAuth(NetworkService.profile(), body);
  }

  profileEdit(body: any): any {
    return this.api.postApiCallAuth(NetworkService.profileEdit(), body);
  }

  logout(): any {
    // return this.api.postApiCallAuth(NetworkService.logout(), body);
    this.router.navigate(['/']);
    localStorage.clear();
    sessionStorage.clear();

    window.location.reload();
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

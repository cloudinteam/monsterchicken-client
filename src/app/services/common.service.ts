import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  deviceInfo: any;

  constructor(
    private api: ApiCallService,
    private deviceService: DeviceDetectorService,
  ) { }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if (localStorage.getItem('_h_key') == undefined) {
      this.getHash();
    }
    if (sessionStorage.getItem('playStoreSkipped') !== 'true') {
      // setTimeout(() => {
      //   $('#playStore').modal('show');
      // }, 1500);
    }
  }

  getHash() {
    let now = new Date();
    let encString =
      this.deviceService.getDeviceInfo().userAgent +
      now.getTime().toString() +
      Math.random();
    this.encMd5(encString);
  }

  encMd5(blob: any) {
    const hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(blob));
    const md5 = hash.toString(CryptoJS.enc.Hex);
    // console.error(md5);
    localStorage.setItem('_h_key', md5);
    sessionStorage.setItem('_h_key', md5);
  }

  upload(data: any) {
    return this.api.postApiCallAuthNEE(NetworkService.upload(), data);
  }

  getStates(body: any): any {
    return this.api.postApiCallAuth(NetworkService.getState(), body);
  }

  getCity(body: any): any {
    return this.api.postApiCallAuth(NetworkService.getCity(), body);
  }

  getCountry(body: any): any {
    return this.api.postApiCallAuth(NetworkService.getCountry(), body);
  }



}

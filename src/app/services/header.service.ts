import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private _disableSearch = true;
  public disableSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._disableSearch);

  private _searchString = '';
  public searchString: BehaviorSubject<string> = new BehaviorSubject<string>(this._searchString);

  private _currentAddress = {address: '', district: '', show: false};
  public currentAddress: BehaviorSubject<any> = new BehaviorSubject<any>(this._currentAddress);

  private _openLogin = false;
  public openLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._openLogin);

  constructor(
    private api: ApiCallService,
  ) { }


  notificationList(): any {
    return this.api.getApiCallAuth(NetworkService.notificationList());
  }

  notificationUpdate(id: string): any {
    return this.api.getApiCallAuth(NetworkService.notificationUpdate(id));
  }

}

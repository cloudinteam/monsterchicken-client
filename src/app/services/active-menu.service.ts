import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveMenuService {

  constructor() { }

  private _checkOut = '';
  public checkoutMenu: BehaviorSubject<string> = new BehaviorSubject<string>(this._checkOut);

  private _addressSuccess = false;
  public addressSuccess: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._addressSuccess);

  private _summarySuccess = false;
  public summarySuccess: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._summarySuccess);

}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveMenuService {

  constructor() { }

  private _checkOut = '';
  public checkoutMenu: BehaviorSubject<string> = new BehaviorSubject<string>(this._checkOut);

  private _checkSuccess = '';
  public checkoutSuccess: BehaviorSubject<string> = new BehaviorSubject<string>(this._checkSuccess);

}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private _disableSearch = true;
  public disableSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._disableSearch);

  private _searchString = '';
  public searchString: BehaviorSubject<string> = new BehaviorSubject<string>(this._searchString);

  private _currentAddress = {address: '', district: ''};
  public currentAddress: BehaviorSubject<any> = new BehaviorSubject<any>(this._currentAddress);

  constructor() { }


}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderService } from '../services/header.service';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private route: Router,
    private headerService: HeaderService,
    private alert: AlertService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log(route);
    // console.log(state.url);
      if (localStorage.getItem('accessToken') && localStorage.getItem('accessToken') != 'undefined') {
        return true;
      }
      localStorage.setItem('next_url', state.url)
      // this.alert.fireToastF('Login to continue');
      this.headerService.openLogin.next(true);
      //this.route.navigate(['/']); // redirect url
      return false;

  }

}

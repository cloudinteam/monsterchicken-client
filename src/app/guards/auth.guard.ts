import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private route: Router
  ) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log(route);
    // console.log(state);
      if (sessionStorage.getItem('accessToken') && sessionStorage.getItem('accessToken') != 'undefined') {
        return true;
      }
      this.route.navigate(['auth/login']); // redirect url
      return false;
    
  }
  
}

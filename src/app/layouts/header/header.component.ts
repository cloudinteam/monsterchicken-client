import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'monster-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

  district = 'Coimbatore';
  address = '3, Lakshmi Nagar, Velandi Palayam, Coimbatore';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {

  }

  logout() {
    this.authService.logout();
  }

  trimAddress(address: string) {
    return address.slice(0, 30)+'...';
  }

  launchSearch() {
    this.router.navigate(['search']);
  }

  home() {
    this.router.navigate(['/']);
  }
}

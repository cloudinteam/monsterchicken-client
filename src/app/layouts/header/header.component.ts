import { HeaderService } from './../../services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'monster-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  district = 'Coimbatore';
  address = '3, Lakshmi Nagar, Velandi Palayam, Coimbatore';

  disableSearch = true;
  searchString = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService
  ) {
    this.headerService.disableSearch.subscribe((r) => {
      this.disableSearch = r;
    });
  }

  ngOnInit(): void {
    // console.log(this.route.url);
  }

  logout() {
    this.authService.logout();
  }

  trimAddress(address: string) {
    return address.slice(0, 30)+'...';
  }

  launchSearch() {
    this.router.navigate(['search']);
    // this.router.navigateByUrl('/search');
    this.disableSearch = false;
    this.headerService.disableSearch.next(false);
  }

  searchFn() {
    this.headerService.searchString.next(this.searchString);
  }

  home() {
    this.router.navigate(['/']);
  }
}

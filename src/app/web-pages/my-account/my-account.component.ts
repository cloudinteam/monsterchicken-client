import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveMenuService } from 'src/app/services/active-menu.service';

@Component({
  selector: 'my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  loading = false;
  active = '';

  constructor(
    private activeMenu: ActiveMenuService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.activeMenu.checkoutMenu.subscribe((menu) => {
      this.active = menu;
    })

    this.loading = false;
    // setTimeout(() => {
    //   this.loading = false;
    // }, 1500)
  }

  goToProfile() {
    this.active = 'profile';
    this.activeMenu.checkoutMenu.next('profile');
    this.router.navigate(['/account/profile']);
  }

  goToAdress() {
    this.active = 'saved-address';
    this.activeMenu.checkoutMenu.next('saved-address');
    this.router.navigate(['/account/saved-address']);
  }

  goToOrders() {
    this.active = 'order-history';
    this.activeMenu.checkoutMenu.next('order-history');
    this.router.navigate(['/account/order-history']);
  }
}

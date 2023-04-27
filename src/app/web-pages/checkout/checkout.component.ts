import { Component, OnInit } from '@angular/core';
import { ActiveMenuService } from 'src/app/services/active-menu.service';
import { AddressService } from 'src/app/services/address.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  loading = false;
  address = '';
  district = '';

  editAddress = false;
  addressAction: any;
  active = '';

  constructor(
    private headerService: HeaderService,
    private addressService: AddressService,
    private activeMenu: ActiveMenuService,
  ){}

  ngOnInit(): void {
    this.addressService.updateAddress.subscribe((r) => {
      this.addressAction = r;
      this.editAddress = true;
    });
    this.headerService.currentAddress.subscribe((r) => {
      this.address = r.address;
      this.district = r.district;
    });
    this.activeMenu.checkoutMenu.subscribe((menu) => {
      this.active = menu;
    })
  }

  updateAddress(data: any) {
    this.addressAction = data;
  }

}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  menu: string = 'address';
  addressSuccess = false;
  summarySuccess = false;

  constructor(
    private headerService: HeaderService,
    private addressService: AddressService,
    private activeMenu: ActiveMenuService,
    private cdRef: ChangeDetectorRef,
  ){}

  ngOnInit(): void {
    this.loading = true;
      this.addressService.updateAddress.subscribe((r) => {
        this.addressAction = r;
        this.editAddress = true;
      });
      this.headerService.currentAddress.subscribe((r) => {
        this.address = r.address;
        this.district = r.district;
      });
      this.activeMenu.checkoutMenu.subscribe((menu) => {
        this.menu = menu;
      })
      this.activeMenu.addressSuccess.subscribe((status) => {
        this.addressSuccess = status;
      })
      this.activeMenu.summarySuccess.subscribe((status) => {
        this.summarySuccess = status;
      })
    this.loading = false;
    this.cdRef.markForCheck();
  }

  updateAddress(data: any) {
    this.addressAction = data;
  }

}

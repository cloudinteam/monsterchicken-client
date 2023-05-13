import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveMenuService } from 'src/app/services/active-menu.service';
import { AddressService } from 'src/app/services/address.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'saved-address',
  templateUrl: './saved-address.component.html',
  styleUrls: ['./saved-address.component.scss']
})
export class SavedAddressComponent implements OnInit {

  loading = false;
  address: any[] = [];
  selectedId = '';
  selectedAddress: any;
  edit = false;

  constructor(
    private addressService: AddressService,
    private alert: AlertService,
    private activeMenu: ActiveMenuService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAddress();
    this.activeMenu.checkoutMenu.next('saved-address');
  }

  getAddress() {
    this.loading = true;
    this.addressService.listAddress({userId: localStorage.getItem('userId')}).subscribe((r: any) => {
      // console.log(r);
      this.address = r.response.addresses;
      this.address.forEach(address => {
        if (address.defaultAddress) {
          this.selectedId = address.id;
        }
      })
      this.loading = false;
    })
  }

  addNewAddres() {
    // this.addAddress.emit()
    this.selectedAddress = null;
    this.edit = true;
  }

  addressEdit(address: any) {
    this.selectedAddress = address;
    this.edit = true
  }

  onSelect($event: any) {
    // console.log(this.selectedAddress);

    let data = {
      userId: localStorage.getItem('userId'),
      addressId: this.selectedId
    }
    this.addressService.setDefault(data).subscribe((r: any) => {
      if (r.status) {
        this.alert.fireToastS(r.message[0]);
        this.getAddress();
      }
    })
  }

  deleteAddress(id: string) {
    let data = {
      addressId: id
    }
    this.addressService.deleteAddress(data).subscribe((r: any) => {
      // console.log(r);
      if (r.status) {
        this.alert.fireToastS(r.message[0]);
        this.getAddress();
      }
    })
  }

  goToSummary() {
    this.activeMenu.addressSuccess.next(true);
    this.router.navigate(['/checkout/summary'])
  }

}
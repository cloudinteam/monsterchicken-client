import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveMenuService } from 'src/app/services/active-menu.service';
import { AddressService } from 'src/app/services/address.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {

  loading = false;
  address: any[] = [];
  selectedAddress = '';
  edit = false;

  @Output() addAddress: EventEmitter<any> = new EventEmitter();
  @Output() editAddress: EventEmitter<any> = new EventEmitter();

  constructor(
    private addressService: AddressService,
    private alert: AlertService,
    private activeMenu: ActiveMenuService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAddress();
    this.activeMenu.checkoutMenu.next('address');
  }

  getAddress() {
    this.loading = true;
    this.addressService.listAddress({}).subscribe((r: any) => {
      // console.log(r);
      this.address = r.response.addresses;
      this.address.forEach(address => {
        if (address.defaultAddress) {
          this.selectedAddress = address.id;
        }
      })
      this.loading = false;
    })
  }

  addNewAddres() {
    // this.addAddress.emit()
    this.edit = true;
  }

  onSelect($event: any) {
    // console.log(this.selectedAddress);

    let data = {
      userId: localStorage.getItem('userId'),
      addressId: this.selectedAddress
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

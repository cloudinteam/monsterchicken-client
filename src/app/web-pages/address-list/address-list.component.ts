import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AddressService } from 'src/app/services/address.service';

@Component({
  selector: 'address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {

  address: any[] = [];
  selectedAddress = '';

  @Output() addAddress: EventEmitter<any> = new EventEmitter();
  @Output() editAddress: EventEmitter<any> = new EventEmitter();

  constructor(
    private addressService: AddressService,
  ) { }

  ngOnInit(): void {
    this.getAddress();
  }

  getAddress() {
    this.addressService.listAddress({}).subscribe((r: any) => {
      // console.log(r);
      this.address = r.response.addresses;
    })
  }

  addNewAddres() {
    this.addAddress.emit()
  }

  onSelect($event: any) {
    console.log(this.selectedAddress);
    console.log($event);
  }

  deleteAddress(id: string) {
    let data = {
      addressId: id
    }
    this.addressService.deleteAddress(data).subscribe((r: any) => {
      console.log(r);
    })
  }

}

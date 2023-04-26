import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddressService } from 'src/app/services/address.service';

@Component({
  selector: 'address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss']
})
export class AddressCardComponent {

  @Input() address!: any;
  @Output() editAddress: EventEmitter<any> = new EventEmitter();
  @Output() removeAddress: EventEmitter<any> = new EventEmitter();
  @Output() makeAddressDefault: EventEmitter<any> = new EventEmitter();

  constructor(
    private addressService: AddressService
  ) { }

  edit(address: any) {
    let data = {
      location: address,
      action: 'edit'
    }
    // this.editAddress.emit(data);
    this.addressService.updateAddress.next(data);
  }

  makeDefault(address: any) {
    this.makeAddressDefault.emit(address);
  }

  deleteAddress(address: any) {
    this.removeAddress.emit(address.id);
  }
}

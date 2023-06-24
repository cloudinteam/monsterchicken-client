import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ActiveMenuService } from 'src/app/services/active-menu.service';
import { AddressService } from 'src/app/services/address.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressListComponent implements OnInit {

  loading = false;
  address: any[] = [];
  selectedId = '';
  selectedAddress: any;
  edit = false;
  adEdit = 'new';

  @Output() addAddress: EventEmitter<any> = new EventEmitter();
  @Output() editAddress: EventEmitter<any> = new EventEmitter();

  constructor(
    private addressService: AddressService,
    private alert: AlertService,
    private activeMenu: ActiveMenuService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getAddress();
    this.selectedAddress = null;
    this.activeMenu.checkoutMenu.next('address');
    this.activeMenu.addressSuccess.next(false);
    this.activeMenu.summarySuccess.next(false);
  }

  getAddress() {
    this.loading = true;
    this.addressService.listAddress().subscribe((r: any) => {
      this.address = r.response.addresses;
      this.address.forEach(address => {
        if (address.default_address) {
          this.selectedId = address.address_id;
        }
      })
      this.edit = false;
      this.adEdit = 'new';
      this.loading = false;
      this.cdRef.markForCheck();
    })
  }

  addNewAddres() {
    // this.addAddress.emit()
    this.adEdit = 'new';
    this.edit = true;
  }

  addressEdit(address: any) {
    this.selectedAddress = address;
    this.edit = true;
    this.adEdit = 'edit';
    this.cdRef.markForCheck();
  }

  onSelect($event: any) {
    // console.log(this.selectedAddress);

    let data = {
      userId: localStorage.getItem('userId'),
      address_id: this.selectedId
    }
    this.addressService.setDefault(data).subscribe((r: any) => {
      if (r.status) {
        // this.alert.fireToastS(r.message[0]);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: r.message[0]
        })
        this.getAddress();
      }
    })
  }

  deleteAddress(id: string) {
    this.addressService.deleteAddress(id).subscribe((r: any) => {
      // console.log(r);
      if (r.status) {
        // this.alert.fireToastS(r.message[0]);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: r.message[0]
        })
        this.getAddress();
      }
    })
  }

  goToSummary() {
    this.activeMenu.addressSuccess.next(true);
    setTimeout(() => {
      this.router.navigate(['/checkout/summary'])
    }, 100)
  }

}

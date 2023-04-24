import { Component, OnInit } from '@angular/core';
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

  constructor(
    private headerService: HeaderService,
  ){}

  ngOnInit(): void {
    this.headerService.currentAddress.subscribe((r) => {
      this.address = r.address;
      this.district = r.district;
    });
  }

}

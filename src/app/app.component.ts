import { Component, OnInit } from '@angular/core';
import { AddressService } from './services/address.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'monster-chicken-frontend';

  constructor(
    private addressService: AddressService,
  ) { }

  ngOnInit(): void {
    this.addressService.getPosition().then((pos: any) => {
      console.log(`Positon: ${pos.lng} ${pos.lat}`);
    });
  }

}

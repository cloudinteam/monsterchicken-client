import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebPagesRoutingModule } from './web-pages-routing.module';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { CarouselModule } from 'primeng/carousel';
import { ProductsListComponent } from './products-list/products-list.component';
import { TooltipModule } from 'primeng/tooltip';
import { CheckoutComponent } from './checkout/checkout.component';
import { ChangeAddressComponent } from './change-address/change-address.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';


@NgModule({
  declarations: [
    SearchComponent,
    HomeComponent,
    ProductsListComponent,
    CheckoutComponent,
    ChangeAddressComponent
  ],
  imports: [
    CommonModule,
    WebPagesRoutingModule,
    SharedModule,
    CarouselModule,
    TooltipModule,
    GoogleMapsModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule
    // AgmCoreModule.forRoot({
    //   // please get your own API key here:
    //   // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
    //   apiKey: 'AIzaSyA5hHeRt5t1M4irYLCh95a0mcaqu8_MFjc'
    // }),
  ]
})
export class WebPagesModule { }

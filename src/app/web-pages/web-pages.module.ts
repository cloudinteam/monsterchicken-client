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
import { ProductViewComponent } from './product-view/product-view.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AddressListComponent } from './address-list/address-list.component';



@NgModule({
  declarations: [
    SearchComponent,
    HomeComponent,
    ProductsListComponent,
    CheckoutComponent,
    ChangeAddressComponent,
    ProductViewComponent,
    ProfileEditComponent,
    AddressListComponent
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
    GooglePlaceModule,
    InputNumberModule,
    NgxDropzoneModule
  ],
  exports: [
    ProfileEditComponent
  ]
})
export class WebPagesModule { }

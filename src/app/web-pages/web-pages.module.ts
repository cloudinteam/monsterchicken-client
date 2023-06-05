import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebPagesRoutingModule } from './web-pages-routing.module';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { CarouselModule } from 'primeng/carousel';
import { CarouselModule as OwlCarouselModule } from 'ngx-owl-carousel-o';
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
import { BullkOrderFormComponent } from './bullk-order-form/bullk-order-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownModule } from 'primeng/dropdown';
import { BulkOrderProductComponent } from './bulk-order-product/bulk-order-product.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { BecomeAFranchiseComponent } from './become-a-franchise/become-a-franchise.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { CareerPageComponent } from './career-page/career-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  declarations: [
    SearchComponent,
    HomeComponent,
    ProductsListComponent,
    CheckoutComponent,
    ChangeAddressComponent,
    ProductViewComponent,
    ProfileEditComponent,
    AddressListComponent,
    BullkOrderFormComponent,
    BulkOrderProductComponent,
    CartPageComponent,
    BecomeAFranchiseComponent,
    AboutPageComponent,
    CareerPageComponent,
    PrivacyPolicyComponent,
    ContactUsComponent
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
    NgxDropzoneModule,
    NgSelectModule,
    DropdownModule,
    OwlCarouselModule,
  ],
  exports: [
    ProfileEditComponent,
    ChangeAddressComponent
  ]
})
export class WebPagesModule { }

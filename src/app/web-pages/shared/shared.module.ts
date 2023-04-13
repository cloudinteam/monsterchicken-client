import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProductCardComponent } from './product-card/product-card.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CartComponent } from './cart/cart.component';
import { CartProductComponent } from './cart-product/cart-product.component';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { LocationComponent } from './location/location.component';
import { AgmCoreModule } from '@agm/core';




@NgModule({
  declarations: [
    CategoriesComponent,
    PageLoaderComponent,
    ProductCardComponent,
    NotFoundComponent,
    CartComponent,
    CartProductComponent,
    LocationComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FlexLayoutModule,
    TooltipModule,
    InputNumberModule,
    FormsModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyA5hHeRt5t1M4irYLCh95a0mcaqu8_MFjc'
    }),
  ],
  exports: [
    CategoriesComponent,
    PageLoaderComponent,
    NotFoundComponent,
    CartComponent,
    ProductCardComponent,
    LocationComponent,
    AgmCoreModule
  ]
})
export class SharedModule { }

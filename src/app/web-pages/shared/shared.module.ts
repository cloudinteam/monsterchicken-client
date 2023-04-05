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


@NgModule({
  declarations: [
    CategoriesComponent,
    PageLoaderComponent,
    ProductCardComponent,
    NotFoundComponent,
    CartComponent,
    CartProductComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FlexLayoutModule,
    TooltipModule,
    InputNumberModule,
    FormsModule
  ],
  exports: [
    CategoriesComponent,
    PageLoaderComponent,
    NotFoundComponent,
    CartComponent,
    ProductCardComponent
  ]
})
export class SharedModule { }

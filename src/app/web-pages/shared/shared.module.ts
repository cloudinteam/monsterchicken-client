import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProductCardComponent } from './product-card/product-card.component';


@NgModule({
  declarations: [
    CategoriesComponent,
    PageLoaderComponent,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FlexLayoutModule
  ],
  exports: [
    CategoriesComponent,
    PageLoaderComponent
  ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProductCardComponent } from './product-card/product-card.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    CategoriesComponent,
    PageLoaderComponent,
    ProductCardComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FlexLayoutModule
  ],
  exports: [
    CategoriesComponent,
    PageLoaderComponent,
    NotFoundComponent
  ]
})
export class SharedModule { }

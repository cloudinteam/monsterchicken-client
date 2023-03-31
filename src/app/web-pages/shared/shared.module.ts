import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';


@NgModule({
  declarations: [
    CategoriesComponent,
    PageLoaderComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
  ],
  exports: [
    CategoriesComponent,
    PageLoaderComponent
  ]
})
export class SharedModule { }

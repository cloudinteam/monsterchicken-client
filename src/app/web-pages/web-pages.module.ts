import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebPagesRoutingModule } from './web-pages-routing.module';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { CarouselModule } from 'primeng/carousel';
import { ProductsListComponent } from './products-list/products-list.component';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  declarations: [
    SearchComponent,
    HomeComponent,
    ProductsListComponent
  ],
  imports: [
    CommonModule,
    WebPagesRoutingModule,
    SharedModule,
    CarouselModule,
    TooltipModule
  ]
})
export class WebPagesModule { }

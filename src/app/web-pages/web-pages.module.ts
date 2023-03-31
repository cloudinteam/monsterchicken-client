import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebPagesRoutingModule } from './web-pages-routing.module';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { CarouselModule } from 'primeng/carousel';


@NgModule({
  declarations: [
    SearchComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    WebPagesRoutingModule,
    SharedModule,
    CarouselModule,
  ]
})
export class WebPagesModule { }

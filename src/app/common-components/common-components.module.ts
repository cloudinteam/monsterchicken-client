import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonComponentsRoutingModule } from './common-components-routing.module';
import { UrlNotFoundComponent } from './url-not-found/url-not-found.component';
import { SharedModule } from '../web-pages/shared/shared.module';
import { WebPagesModule } from '../web-pages/web-pages.module';


@NgModule({
  declarations: [
    UrlNotFoundComponent
  ],
  imports: [
    CommonModule,
    CommonComponentsRoutingModule,
    WebPagesModule,
    SharedModule,

  ]
})
export class CommonComponentsModule { }

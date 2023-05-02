import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAccountRoutingModule } from './my-account-routing.module';
import { MyAccountComponent } from './my-account.component';
import { SharedModule } from '../shared/shared.module';
import { SavedAddressComponent } from './saved-address/saved-address.component';
import { WebPagesModule } from '../web-pages.module';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    MyAccountComponent,
    SavedAddressComponent,
    OrderHistoryComponent
  ],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    SharedModule,
    WebPagesModule,
    TableModule
  ]
})
export class MyAccountModule { }

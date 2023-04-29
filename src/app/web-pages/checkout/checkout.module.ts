import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { SharedModule } from '../shared/shared.module';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    OrderSummaryComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    SharedModule,
    FlexModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CheckoutModule { }

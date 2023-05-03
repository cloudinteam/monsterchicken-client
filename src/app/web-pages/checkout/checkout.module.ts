import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { SharedModule } from '../shared/shared.module';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentComponent } from './payment/payment.component';



@NgModule({
  declarations: [
    OrderSummaryComponent,
    PaymentComponent
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { CheckoutComponent } from './checkout.component';
import { AddressListComponent } from '../address-list/address-list.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'address',
        pathMatch: 'full',
      },
      {
        path: 'summary',
        component: OrderSummaryComponent,
      },
      {
        path: 'address',
        component: AddressListComponent
      },
      {
        path: 'payment/:orderId',
        component: PaymentComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}

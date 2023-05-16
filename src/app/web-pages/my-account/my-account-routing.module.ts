import { AddressListComponent } from './../address-list/address-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountComponent } from './my-account.component';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';
import { SavedAddressComponent } from './saved-address/saved-address.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  {
    path: '',
    component: MyAccountComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        component: ProfileEditComponent,
      },
      {
        path: 'saved-address',
        component: SavedAddressComponent,
      },
      {
        path: 'order-history',
        component: OrderHistoryComponent,
      },
      {
        path: 'notifications',
        component: NotificationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule { }

import { AddressListComponent } from './../address-list/address-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountComponent } from './my-account.component';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';
import { SavedAddressComponent } from './saved-address/saved-address.component';

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
        component: ProfileEditComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule { }

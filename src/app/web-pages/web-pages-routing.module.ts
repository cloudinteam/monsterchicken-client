import { HomeComponent } from './home/home.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'products',
    component: ProductsListComponent
  },
  {
    path: 'category/:id',
    component: ProductsListComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebPagesRoutingModule { }

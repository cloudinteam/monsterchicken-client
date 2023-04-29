import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { AuthGuard } from '../guards/auth.guard';

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
    loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'product/:id',
    component: ProductViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebPagesRoutingModule { }

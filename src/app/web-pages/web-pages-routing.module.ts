import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { AuthGuard } from '../guards/auth.guard';
import { BullkOrderFormComponent } from './bullk-order-form/bullk-order-form.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { BecomeAFranchiseComponent } from './become-a-franchise/become-a-franchise.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { CareerPageComponent } from './career-page/career-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { BlogComponent } from './blog/blog.component';
import { BlogViewComponent } from './blog-view/blog-view.component';

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
    path: 'cart',
    component: CartPageComponent
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    loadChildren: () => import('./my-account/my-account.module').then(m => m.MyAccountModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'product/:id',
    component: ProductViewComponent
  },
  {
    path: 'bulk-order',
    component: BullkOrderFormComponent
  },
  {
    path: 'become-a-franchise',
    component: BecomeAFranchiseComponent
  },
  {
    path: 'about-us',
    component: AboutPageComponent
  },
  {
    path: 'blog',
    component: BlogComponent
  },
  {
    path: 'blog/:id',
    component: BlogViewComponent
  },
  {
    path: 'career',
    component: CareerPageComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebPagesRoutingModule { }

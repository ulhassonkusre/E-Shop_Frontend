import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { AccountComponent } from './components/account/account.component';
import { OrdersComponent } from './components/orders/orders.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'products/:id', component: ProductDetailsComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'order-success', component: OrderSuccessComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

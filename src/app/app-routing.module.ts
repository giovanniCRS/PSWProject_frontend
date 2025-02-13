import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminAuthComponent } from './admin-auth/admin-auth.component';
import { LoginComponent } from './login/login.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AuthGuard } from './auth.guard';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddProductComponent } from './add-product/add-product.component';
import { RegisterComponent } from './register/register.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { userGGuard } from './user-g.guard';
import { SearchProdComponent } from './search-prod/search-prod.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'admin-auth',component:AdminAuthComponent},
  {path:'login',component:LoginComponent},
  {path:'checkout',component:CheckoutComponent, canActivate:[userGGuard]},
  {path:'admin-home', component:AdminHomeComponent, canActivate:[AuthGuard]},
  {path:'admin-home/add-category', component:AddCategoryComponent, canActivate:[AuthGuard]},
  {path:'admin-home/add-product', component:AddProductComponent, canActivate:[AuthGuard]},
  {path:'user-home', component:UserHomeComponent, canActivate:[userGGuard]},
  {path:'login/register',component:RegisterComponent},
  {path:'search-prod',component:SearchProdComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

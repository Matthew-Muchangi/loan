import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { CustomerComponent } from './component/customer/customer.component';
import { LoanComponent } from './component/loan/loan.component';
import { AuthGuard } from './guards/auth.guard'; // Import AuthGuard

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Protected
  { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard] }, // Protected
  { path: 'loan', component: LoanComponent, canActivate: [AuthGuard] } // Protected
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { LoginComponent } from './user-profile-management/login/login.component';
import { ProfileComponent } from './user-profile-management/profile/profile.component';
import { RegisterComponent } from './user-profile-management/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgetPassComponent } from './user-profile-management/login/forget-pass/forget-pass.component';

const routes: Routes = [
  {path:'dashboard' ,component:DashboardComponent},
  {path:'side-nav' ,component:SideNavComponent},
  {path:'login' ,component:LoginComponent},
  {path:'profile' ,component:ProfileComponent},
  {path:'register' ,component:RegisterComponent},
  {path:'forget-pass' ,component:ForgetPassComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalConnectRoutingModule { }

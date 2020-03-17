import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';


const routes: Routes = [
  { path: '', component: UserProfileComponent },
  { path: 'home', component: NavBarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

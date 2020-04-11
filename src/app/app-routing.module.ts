import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MyJobsComponent } from './my-jobs/my-jobs.component';
import { JobHistoryComponent } from './job-history/job-history.component';
import { MyPageComponent } from './my-page/my-page.component';
import { ChatsComponent } from './chats/chats.component';
import { MapComponent } from './map/map.component';
import { CreateAccountComponent } from './create-account/create-account.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: UserProfileComponent},
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'home', component: NavBarComponent,
    children: [
      { path: '', redirectTo: 'map', pathMatch: 'full'},
      { path: 'map', component: MapComponent, outlet: 'navLinks' },
      { path: 'my-jobs', component: MyJobsComponent, outlet: 'navLinks'},
      { path: 'job-history', component: JobHistoryComponent, outlet: 'navLinks'},
      { path: 'my-page', component: MyPageComponent, outlet: 'navLinks'},
      { path: 'chats', component: ChatsComponent, outlet: 'navLinks' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

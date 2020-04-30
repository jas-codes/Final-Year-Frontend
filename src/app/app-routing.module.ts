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
import { ChatComponent } from './chats/components/chat/chat.component';
import { JobDetailsComponent } from './my-jobs/components/job-details/job-details.component';
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: UserProfileComponent},
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'home', component: NavBarComponent,
    children: [
      { path: '', redirectTo: 'map', pathMatch: 'full'},
      { path: 'map', component: MapComponent, outlet: 'navLinks', canActivate: [AuthGuard] },
      { path: 'my-jobs', component: MyJobsComponent, outlet: 'navLinks', canActivate: [AuthGuard]},
      { path: 'my-jobs/:id', component: JobDetailsComponent, outlet:'navLinks', canActivate: [AuthGuard]},
      { path: 'job-history', component: JobHistoryComponent, outlet: 'navLinks', canActivate: [AuthGuard]},
      { path: 'my-page', component: MyPageComponent, outlet: 'navLinks', canActivate: [AuthGuard]},
      { path: 'chats', component: ChatsComponent, outlet: 'navLinks', canActivate: [AuthGuard]},
      { path: 'chats/:id', component: ChatComponent, outlet: 'navLinks', canActivate: [AuthGuard]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

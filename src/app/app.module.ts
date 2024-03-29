import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MapComponent } from './map/map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MyJobsComponent } from './my-jobs/my-jobs.component';
import { JobHistoryComponent } from './job-history/job-history.component';
import { MyPageComponent } from './my-page/my-page.component';
import { ChatsComponent } from './chats/chats.component';
import { NewJobComponent } from './map/map-components/new-job-component/new-job/new-job.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { JobListComponent } from './my-jobs/components/job-list/job-list.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { FirebaseConfig } from 'src/environments/firebase-config';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { HttpClientModule } from '@angular/common/http';
import { QuoteComponent } from './quote/quote.component';
import { ChatListComponent } from './chats/components/chat-list/chat-list.component';
import { ChatComponent } from './chats/components/chat/chat.component';
import { ChatListPipe } from './pipes/chat-list.pipe';
import { JobDetailsComponent } from './my-jobs/components/job-details/job-details.component';
import { JobSearchPipe } from './pipes/job-search.pipe';
import { MatRadioModule } from '@angular/material/radio';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { DatePipe } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReviewComponent } from './review/review.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularFireModule } from '@angular/fire/compat';

const ANGULAR_MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatSelectModule,
  MatFormFieldModule,
  MatInputModule,
  FormsModule,
  MatIconModule,
  MatTabsModule,
  MatToolbarModule,
  MatButtonToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule
]

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MyJobsComponent,
    JobHistoryComponent,
    MyPageComponent,
    ChatsComponent,
    NewJobComponent,
    JobListComponent,
    UserProfileComponent,
    NavBarComponent,
    CreateAccountComponent,
    QuoteComponent,
    ChatListComponent,
    ChatComponent,
    ChatListPipe,
    JobDetailsComponent,
    JobSearchPipe,
    CompanyDetailsComponent,
    ReviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    ANGULAR_MATERIAL_MODULES,
    AngularFireModule.initializeApp(FirebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    MatDatepickerModule,
    DatePipe
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

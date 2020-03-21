import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NgZone } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MapComponent } from './map/map.component';
import { AgmCoreModule } from '@agm/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MyJobsComponent } from './my-jobs/my-jobs.component';
import { JobHistoryComponent } from './job-history/job-history.component';
import { MyPageComponent } from './my-page/my-page.component';
import { ChatsComponent } from './chats/chats.component';
import { NewJobComponent } from './map/map-components/new-job-component/new-job/new-job.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import { JobListComponent } from './my-jobs/components/job-list/job-list.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {  AngularFireAuthModule } from '@angular/fire/auth';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

const firebaseConfig = {
  apiKey: "AIzaSyDU0JQdGmW2MY0G1DHPNO4a7fHm6IuMh-Y",
  authDomain: "tradesman-application.firebaseapp.com",
  databaseURL: "https://tradesman-application.firebaseio.com",
  projectId: "tradesman-application",
  storageBucket: "tradesman-application.appspot.com",
  messagingSenderId: "468613656053",
  appId: "1:468613656053:web:1cc160661ac2b8d74744bc",
  measurementId: "G-EYSG4Y0LF7"
};

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
  MatToolbarModule
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBJYGKxKZsN2GiNHLVHwmz3rLy8baUceU4'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    ANGULAR_MATERIAL_MODULES,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewJobComponent } from './new-job.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthMock } from 'src/app/testing/angular-fire-auth-mock';
import { AngularFirestoreMock } from 'src/app/testing/angular-firestore-mock';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthServiceMock } from 'src/app/testing/auth-service-mock';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AngularFireStorageMock } from 'src/app/testing/angular-fire-storage-mock';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NewJobComponent', () => {
  let component: NewJobComponent;
  let fixture: ComponentFixture<NewJobComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewJobComponent ],
      providers: [
        { provide: AngularFireAuth, useValue: AngularFireAuthMock},
        { provide: AngularFirestore, useValue: AngularFirestoreMock },
        { provide: AuthService, useValue: AuthServiceMock },
        {provide: AngularFireStorage, useValue: AngularFireStorageMock},
        HttpClient,
        HttpHandler
      ],
      imports: [
        ReactiveFormsModule, 
        FormsModule, 
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailsComponent } from './job-details.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFireAuthMock } from 'src/app/testing/angular-fire-auth-mock';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreMock } from 'src/app/testing/angular-firestore-mock';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { AuthServiceMock } from 'src/app/testing/auth-service-mock';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireStorageMock } from 'src/app/testing/angular-fire-storage-mock';

describe('JobDetailsComponent', () => {
  let component: JobDetailsComponent;
  let fixture: ComponentFixture<JobDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDetailsComponent ],
      providers: [
        HttpClient,
        HttpHandler,
        {provide: AngularFireAuth, useValue: AngularFireAuthMock},
        {provide: AngularFirestore, useValue: AngularFirestoreMock},
        {provide: AuthService, useValue: AuthServiceMock},
        {provide: AngularFireStorage, useValue: AngularFireStorageMock}
      ],
      imports: [
        RouterTestingModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

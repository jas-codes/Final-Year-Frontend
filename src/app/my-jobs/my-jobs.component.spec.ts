import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyJobsComponent } from './my-jobs.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthMock } from '../testing/angular-fire-auth-mock';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthServiceMock } from '../testing/auth-service-mock';
import { AuthService } from '../services/auth.service';

describe('MyJobsComponent', () => {
  let component: MyJobsComponent;
  let fixture: ComponentFixture<MyJobsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyJobsComponent ],
      providers: [
        HttpClient,
        HttpHandler,
        {provide: AngularFireAuth, useValue: AngularFireAuthMock},
        {provide: AngularFirestore, useValue: AngularFirestoreMock},
        {provide: AuthService, useValue: AuthServiceMock}
      ],
      imports: [
        RouterTestingModule,

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

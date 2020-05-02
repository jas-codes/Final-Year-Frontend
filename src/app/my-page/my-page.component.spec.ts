import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPageComponent } from './my-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireAuthMock } from '../testing/angular-fire-auth-mock';
import { AuthService } from '../services/auth.service';
import { AuthServiceMock } from '../testing/auth-service-mock';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorageMock } from '../testing/angular-fire-storage-mock';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

describe('MyPageComponent', () => {
  let component: MyPageComponent;
  let fixture: ComponentFixture<MyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPageComponent ],
      providers: [
        {provide: AngularFireAuth, useValue: AngularFireAuthMock},
        {provide: AuthService, useValue: AuthServiceMock},
        {provide: AngularFireStorage, useValue: AngularFireStorageMock},
        {provide: AngularFirestore, useValue: AngularFirestoreMock},
        HttpClient,
        HttpHandler
      ],
      imports: [ReactiveFormsModule, FormsModule, MatSlideToggleModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountComponent } from './create-account.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireStorageMock } from '../testing/angular-fire-storage-mock';
import { AngularFireAuthMock } from '../testing/angular-fire-auth-mock';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { AuthServiceMock } from '../testing/auth-service-mock';
import { UserTypes } from '../enums/user-types';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountComponent ],
      imports: [ ReactiveFormsModule, FormsModule,
        MatDatepickerModule,      
        MatNativeDateModule,
        RouterTestingModule,
        MatButtonToggleModule
      ],
      providers: [
        { provide: AngularFireAuth, useValue: AngularFireAuthMock},
        {provide: AngularFirestore, useValue: AngularFirestoreMock},
        {provide: AngularFireStorage, useValue: AngularFireStorageMock},
        {provide: AuthService, userValue: AuthServiceMock}
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const testCasesPasswordMatch = [
    {password1: 'test1', password2: 'test1', expected: true},
    {password1: 'test1', password2: 'test2', expected: false},
    {password1: 'test2', password2: 'test1', expected: false},
    {password1: '', password2: '', expected: true}
  ]
  testCasesPasswordMatch.forEach((testCase, index) => {
    it(`Should compare two password strings (str1: ${testCase.password1}, str2: ${testCase.password2}) and give the boolean result, ${testCase.expected}. (testCase: ${index})`, () => {
      component.form.get('password').setValue(testCase.password1);
      component.form.get('rePassword').setValue(testCase.password2);
      component.comparePasswords();
      expect(component.passwordMatch).toBe(testCase.expected);
    })
  });

  const testCasesTradeCheck = [
    {userType: UserTypes.trader, expected: true},
    {userType: UserTypes.user, expected: false},
    {userType: '', expected: false},
    {userType: undefined, expected: false}
  ]
  testCasesTradeCheck.forEach((testCase, index) => {
    it(`Should evaluate the usertype selected (type: ${testCase.userType}) as trader or not, result: ${testCase.expected}. (testCase: ${index})`, () => {
      component.traderSelected(testCase.userType);
      expect(component.trader).toBe(testCase.expected);
    })
  })
});

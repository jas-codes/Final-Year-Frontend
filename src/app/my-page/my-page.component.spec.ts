import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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

  beforeEach(waitForAsync(() => {
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

  describe('company changes tests', () => {
    it('should trigger and upload of new company details on makeChangesToCompany', () => {
      spyOn(component.companyService, "updateCompany");
      component.makeChangesToCompany();
      expect(component.companyService.updateCompany).toHaveBeenCalled();
    });

    it('should trigger and not throw on makeChangesToCompany', () => {
      spyOn(component.companyService, "updateCompany");
      expect(() => { component.makeChangesToCompany() }).not.toThrow();
    });

    it('should toggle show company gallery property between true and false', () => {
      expect(component.companyGallery).toBeFalse();
      component.showCompanyGallery();
      expect(component.companyGallery).toBeTrue();
      component.showCompanyGallery();
      expect(component.companyGallery).toBeFalse();
    });

    it('should call companyFormLogic Correctly from companyFormToggle() when editing company is true', () => {
      spyOn(component, 'onCompanyFormEdit');
      spyOn(component.companyInfoForm, 'enable');
      spyOn(component.companyInfoForm, 'disable');
      spyOn(component, 'makeChangesToCompany');
      component.editCompanyDetails = true;
      component.companyFormToggle();
      expect(component.companyInfoForm.enable).toHaveBeenCalled();
      expect(component.onCompanyFormEdit).toHaveBeenCalled();
      expect(component.companyInfoForm.disable).not.toHaveBeenCalled();
      expect(component.makeChangesToCompany).not.toHaveBeenCalled();
    });

    it('should call companyFormLogic Correctly from companyFormToggle() when editing company is false', () => {
      spyOn(component.companyInfoForm, 'disable');
      spyOn(component, 'makeChangesToCompany');
      spyOn(component, 'onCompanyFormEdit');
      spyOn(component.companyInfoForm, 'enable');
      component.editCompanyDetails = false;
      component.companyFormToggle();
      expect(component.companyInfoForm.disable).toHaveBeenCalled();
      expect(component.makeChangesToCompany).not.toHaveBeenCalled();
      expect(component.onCompanyFormEdit).not.toHaveBeenCalled();
      expect(component.companyInfoForm.enable).not.toHaveBeenCalled();
    });
  });

  describe('user changes tests', () => {
    it('should call userFormLogic Correctly from userFormToggle() when editing user it true', () => {
      spyOn(component.userInfoForm, 'disable');
      spyOn(component.userInfoForm, 'enable');
      spyOn(component, 'onUserFormEdit');
      component.editUserDetails = true;
      component.userFormToggle();
      expect(component.userInfoForm.enable).toHaveBeenCalled();
      expect(component.onUserFormEdit).toHaveBeenCalled();
      expect(component.userInfoForm.disable).not.toHaveBeenCalled();
    });

    it('should call userFormLogic Correctly from userFormToggle() when editing user it false', () => {
      spyOn(component.userInfoForm, 'disable');
      spyOn(component.userInfoForm, 'enable');
      spyOn(component, 'onUserFormEdit');
      component.editUserDetails = false;
      component.userFormToggle();
      expect(component.userInfoForm.enable).not.toHaveBeenCalled();
      expect(component.onUserFormEdit).not.toHaveBeenCalled();
      expect(component.userInfoForm.disable).toHaveBeenCalled();
    });
  })
});

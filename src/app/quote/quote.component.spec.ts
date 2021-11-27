import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuoteComponent } from './quote.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Quote } from '../models/quote';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthMock } from '../testing/angular-fire-auth-mock';
import { AuthServiceMock } from '../testing/auth-service-mock';
import { AuthService } from '../services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireStorageMock } from '../testing/angular-fire-storage-mock';

describe('QuoteComponent', () => {
  let component: QuoteComponent;
  let fixture: ComponentFixture<QuoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteComponent ],
      providers: [
        {provide: AngularFireAuth, useValue: AngularFireAuthMock},
        {provide: AngularFirestore, useValue: AngularFirestoreMock},
        { provide: AngularFireStorage, useValue: AngularFireStorageMock},
        {provide: AuthService, useValue: AuthServiceMock}
      ],
      imports: [
        ReactiveFormsModule, FormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  describe('event emitter tests', () => {
    it('should emit dismiss event', () => {
      spyOn(component.dismiss, 'emit');
      component.dismissComponent();
      expect(component.dismiss.emit).toHaveBeenCalledWith(true);
    })

    it('should emit quote event', () => {
      spyOn(component.quote, 'emit');
      component.registerQuote();
      expect(component.quote.emit).toHaveBeenCalledWith(1);
    })
  })
});

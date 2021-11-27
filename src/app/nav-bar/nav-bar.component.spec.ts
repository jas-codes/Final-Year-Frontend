import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthMock } from '../testing/angular-fire-auth-mock';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';
import { AuthServiceMock } from '../testing/auth-service-mock';
import { AuthService } from '../services/auth.service';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ RouterModule,
      RouterTestingModule ],
      declarations: [ NavBarComponent ],
      providers: [
        { provide: AngularFireAuth, useValue: AngularFireAuthMock},
        {provide: AngularFirestore, useValue: AngularFirestoreMock},
        {provide: AuthService, useValue: AuthServiceMock}
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

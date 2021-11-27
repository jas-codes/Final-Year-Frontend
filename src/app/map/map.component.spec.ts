import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapComponent } from './map.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFireAuthMock } from '../testing/angular-fire-auth-mock';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthServiceMock } from '../testing/auth-service-mock';
import { AuthService } from '../services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireStorageMock } from '../testing/angular-fire-storage-mock';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      imports: [RouterTestingModule],
      providers: [
        { provide: AngularFireAuth, useValue: AngularFireAuthMock},
        { provide: AngularFirestore, useValue: AngularFirestoreMock },
        { provide: AuthService, useValue: AuthServiceMock },
        { provide: AngularFireStorage, useValue: AngularFireStorageMock},
        RouterTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobListComponent } from './job-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthMock } from 'src/app/testing/angular-fire-auth-mock';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreMock } from 'src/app/testing/angular-firestore-mock';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { AuthServiceMock } from 'src/app/testing/auth-service-mock';

describe('JobListComponent', () => {
  let component: JobListComponent;
  let fixture: ComponentFixture<JobListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobListComponent],
      providers: [
        RouterTestingModule,
        { provide: AuthService, useValue: AuthServiceMock },
        { provide: AngularFirestore, useValue: AngularFirestoreMock },
        { provide: AngularFireAuth, useValue: AngularFireAuthMock }
      ],
      imports: [ReactiveFormsModule, FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

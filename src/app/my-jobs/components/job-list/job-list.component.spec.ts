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
import { JobSearchPipe } from 'src/app/pipes/job-search.pipe';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireStorageMock } from 'src/app/testing/angular-fire-storage-mock';
import { JobTestData } from 'src/app/testing/job-testing-data';
import { CompletionState } from 'src/app/enums/completionState';

describe('JobListComponent', () => {
  let component: JobListComponent;
  let fixture: ComponentFixture<JobListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobListComponent, JobSearchPipe],
      providers: [
        RouterTestingModule,
        { provide: AuthService, useValue: AuthServiceMock },
        { provide: AngularFirestore, useValue: AngularFirestoreMock },
        { provide: AngularFireAuth, useValue: AngularFireAuthMock },
        { provide: AngularFireStorage, useValue: AngularFireStorageMock}
      ],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
      
    let jobsData = new JobTestData();
    component.jobs = jobsData.jobs;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const listTypesTestCases = [
    { type: CompletionState.closed, expect: 1 },
    { type: CompletionState.active, expect: 2 }
  ]
  listTypesTestCases.forEach((testCase, index) => {
    it(`should filter jobs based on the completion state, completion state: ${testCase.type}, should be length: ${index}`, () => {
      component.listTypes = [];
      component.listTypes.push(testCase.type);
      component.filterJobs();
      expect(component.jobs.length).toEqual(testCase.expect);
      component.jobs.forEach((job) => {
        expect(job.completionState).toEqual(testCase.type);
      });
    });
  })

});

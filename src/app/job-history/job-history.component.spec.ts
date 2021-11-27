import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobHistoryComponent } from './job-history.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Job } from '../models/job';

describe('JobHistoryComponent', () => {
  let component: JobHistoryComponent;
  let fixture: ComponentFixture<JobHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobHistoryComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  var jobs: Job[] = [
    new Job(),
    undefined
  ]

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const selectedJobTestCases = [
    {jobsIndex: 0, expect: 0},
    {jobsIndex: 1, expect: 1}
  ]
  selectedJobTestCases.forEach((testCase, index) => {
    it(`Should populate selected Job with job[${testCase.jobsIndex}] if not undefined, result: job[${testCase.expect}]. (test case: ${index})`, () => {
      component.setJob(jobs[testCase.jobsIndex]);
      expect(component.selectedJob).toEqual(jobs[testCase.expect]);
    })
  })
});

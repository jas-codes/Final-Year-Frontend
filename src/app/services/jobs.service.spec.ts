import { TestBed } from '@angular/core/testing';

import { JobsService } from './jobs.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthMock } from '../testing/angular-fire-auth-mock';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireStorageMock } from '../testing/angular-fire-storage-mock';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';

describe('JobsService', () => {
  let service: JobsService;

  let workCandidate = [
    ['1','2','3','4','5','6','7'],
    ['1','2','3','4','5'],
    [],
  ]

  let workCandidateExpectations = [
    ['1','2','3','4','5','7'],
    ['1','2','3','4'],
    ['2','3','4','5'],
    [],
    ['1','2','3','4','5']
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: AngularFireAuthMock},
        {provide: AngularFirestore, useValue: AngularFirestoreMock},
        {provide: AngularFireStorage, useValue: AngularFireStorageMock}
      ]
    });
    service = TestBed.inject(JobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('remove work candidates from job', () => {
    it('should throw error when undefined passed in', () => {
      expect(service.removeWorkCandidates).toThrowError();
    });

    const workCandidatesTestCases = [
      {workCandidateArray: 0, expect: 0, uid: '6'},
      {workCandidateArray: 1, expect: 1, uid: '5'},
      {workCandidateArray: 1, expect: 2, uid: '1'},
      {workCandidateArray: 2, expect: 3, uid: '4'},
      {workCandidateArray: 1, expect: 4, uid: undefined}
    ]
    workCandidatesTestCases.forEach((testCase, index) => {
      it(`should return the workcandidate array (WCArray${testCase.workCandidateArray}) with uid: ${testCase.uid} removed. (test case ${index})`, () => {
        let array = service.removeWorkCandidates(testCase.uid, workCandidate[testCase.workCandidateArray]);
        expect(array).toEqual(workCandidateExpectations[testCase.expect]);
      })
    })
  })
  
});

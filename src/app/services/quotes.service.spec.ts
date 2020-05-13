import { TestBed } from '@angular/core/testing';

import { QuotesService } from './quotes.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';
import { Quote } from '../models/quote';

describe('QuotesService', () => {
  let service: QuotesService;

  let quotesList: Quote[] = [
    { id: '1', traderUid: '1', amount: 200, companyName: 'name', jobId: '1' },
    { id: '2', traderUid: '2', amount: 200, companyName: 'name1', jobId: '1' },
    { id: '3', traderUid: '3', amount: 200, companyName: 'name2', jobId: '1' },
  ]

  let jobQuotes = ['1', '2', '3']

  let expectedJobQuotes = [
    ['1', '3'],
    ['1', '2'],
    ['2', '3'],
    ['1', '2', '3']
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useValue: AngularFirestoreMock }
      ]
    });
    service = TestBed.inject(QuotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Remove Quote From Job Tests', () => {
    it('should throw error when called with undefined', () => {
      expect(service.removeQuoteFromJob).toThrowError();
    });

    const removeQuotesTestCases = [
      { uid: '2', expected: 0 },
      { uid: '3', expected: 1 },
      { uid: '1', expected: 2 },
      { uid: undefined, expected: 3 }
    ]
    removeQuotesTestCases.forEach((testCase, index) => {
      it(`should remove quote by user, ${testCase.uid} and return quote list, quoteList[${testCase.expected}]`, () => {
        spyOn(service, 'deleteQuote');
        let array = service.removeQuoteFromJob(quotesList,jobQuotes,testCase.uid);
        expect(array).toEqual(expectedJobQuotes[testCase.expected]);
      })
    })
  })
});

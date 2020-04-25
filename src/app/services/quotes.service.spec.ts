import { TestBed } from '@angular/core/testing';

import { QuotesService } from './quotes.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';

describe('QuotesService', () => {
  let service: QuotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: AngularFirestore, useValue: AngularFirestoreMock}
      ]
    });
    service = TestBed.inject(QuotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

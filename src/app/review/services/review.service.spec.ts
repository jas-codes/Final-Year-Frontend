import { TestBed } from '@angular/core/testing';

import { ReviewService } from './review.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreMock } from 'src/app/testing/angular-firestore-mock';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: AngularFirestore, useValue: AngularFirestoreMock}
      ],
    });
    service = TestBed.inject(ReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ChatService } from './chat.service';
import { AngularFirestoreMock } from 'src/app/testing/angular-firestore-mock';
import { AngularFirestore } from '@angular/fire/firestore';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: AngularFirestore, useValue: AngularFirestoreMock},
      ]
    });
    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

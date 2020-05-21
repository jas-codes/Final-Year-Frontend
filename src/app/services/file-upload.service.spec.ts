import { TestBed } from '@angular/core/testing';

import { FileUploadService } from './file-upload.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthMock } from '../testing/angular-fire-auth-mock';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireStorageMock } from '../testing/angular-fire-storage-mock';

describe('FileUploadService', () => {
  let service: FileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: AngularFireAuthMock},
        {provide: AngularFirestore, useValue: AngularFirestoreMock},
        {provide: AngularFireStorage, useValue: AngularFireStorageMock}
      ]
    });
    service = TestBed.inject(FileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a filename with a hyphen and 4 digit number at then end', () => {
    service.createFileName('test');
    let hyphen = service.fileName[4];
    let firstDigit = parseInt(service.fileName[6]);
    let length = service.fileName.length;
    expect(hyphen).toBe('-');
    expect(firstDigit).toBeInstanceOf(Number);
    expect(length).toBeGreaterThanOrEqual(5);
  })
});

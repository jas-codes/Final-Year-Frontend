import { TestBed } from '@angular/core/testing';

import { CompaniesService } from './companies.service';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl } from '@angular/forms';
import { TradeType } from '../enums/trade-types';

describe('CompaniesService', () => {
  let service: CompaniesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useValue: AngularFirestoreMock },
      ]
    });
    service = TestBed.inject(CompaniesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call upload new company and not throw error', () => {
    let formGroup = new FormGroup({
      companyName: new FormControl('test Value'),
      email: new FormControl('email@email.com'),
      phoneNumber: new FormControl('0000000000'),
      postcode: new FormControl('TEST123'),
      tradeType: new FormControl(TradeType.builder),
    });
    const data = { lnglat: 20, uid: 1}
    
    spyOn(service, 'uploadNewCompany');
    expect(() => service.createCompany(formGroup, data)).not.toThrow();
  })
});

import { Injectable } from '@angular/core';
import { Company } from '../models/company';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  companyCollection: AngularFirestoreCollection<Company>;

  constructor(
    private afirestore: AngularFirestore
  ) { }

  createCompany(form: FormGroup, data) {
    var company = new Company();
    company.companyName = form.get('companyName').value;
    company.email = data.email;
    company.phoneNumber = data.phoneNumber;
    company.postcode = data.postcode;
    company.latlng = {...data.lngLat};
    company.tradeType = form.get('tradeType').value;
    company.uid = data.uid;
    
    this.uploadNewCompany(company);
  }

  uploadNewCompany(company: Company) {
    return of(this.afirestore.collection('companies')
      .doc(company.uid)
      .set({...company})
      .catch(error => this.errorHandler(error))
    );
  }

  getCompanies() {
    return this.companyCollection = this.afirestore.collection('companies');
  }

  getCompanyByUid(uid: string) {
    return this.afirestore.doc<Company>(`companies/${uid}`);
  }

  updateCompany(company: Company) {
    this.afirestore.doc<Company>(`companies/${company.uid}`).update({...company})
      .catch(error => this.errorHandler(error));
  }

  errorHandler(error) {
    console.log(error);
  }
}

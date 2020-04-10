import { Injectable } from '@angular/core';
import { Company } from '../models/company';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  companyCollection: AngularFirestoreCollection<Company>;

  constructor(
    private afirestore: AngularFirestore
  ) { }

  uploadNewCompany(company: Company) {
    return of(this.afirestore.collection('companies')
      .add({ ...company })
      .then(data => console.log(data))
      .catch((error) => this.errorHandler(error)
      )
    );
  }

  getCompanies() {
    return this.companyCollection = this.afirestore.collection('companies');
  }

  getCompanyByUid(uid: string) {
    return of(this.afirestore.doc<Company>(`companies/${uid}`))
  }

  errorHandler(error) {
    console.log(error);
  }
}

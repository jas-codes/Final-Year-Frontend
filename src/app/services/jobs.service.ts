import { Injectable, ErrorHandler } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Job } from '../models/job';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(
    private afirestore: AngularFirestore
  ) { }

  uploadNewJob(job: Job){
    return of(this.afirestore.collection('jobs')
      .add({...job})
      .then(data => console.log(data))
      .catch((error) => this.errorHandler(error)
      )
    )
  }

  errorHandler(error) {
    console.log(error);
  }
}

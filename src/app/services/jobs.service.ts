import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Job } from '../models/job';
import { of } from 'rxjs/internal/observable/of';
import { CompletionState } from '../enums/completionState';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  jobCollection: AngularFirestoreCollection<Job>;

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

  getJobs(){
    return this.jobCollection = this.afirestore.collection('jobs');
  }

  
  getMapJobs(){
    return this.jobCollection = this.afirestore.collection<Job>('jobs', ref => {
      return ref
        .where('completionState', '==', CompletionState.pending);
    });
  }

  getJobsForUser(uid: string) {
    return this.jobCollection = this.afirestore.collection('jobs', ref => ref.where('issueUid', '==', uid));
  }

  errorHandler(error) {
    console.log(error);
  }
}

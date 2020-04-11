import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Job } from '../models/job';
import { of } from 'rxjs/internal/observable/of';
import { CompletionState } from '../enums/completionState';
import { Quote } from '../models/quote';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  jobCollection: AngularFirestoreCollection<Job>;

  constructor(
    private afirestore: AngularFirestore
  ) { }

  uploadNewJob(job: Job){
    job.id = this.afirestore.createId();
    return of(this.afirestore.collection('jobs')
      .doc(job.id)
      .set({...job})
      .catch(error => this.errorHandler(error))
    );
  }

  getJobs(){
    return this.afirestore.collection('jobs');
  }

  
  getMapJobs(){
    return this.afirestore.collection<Job>('jobs', ref => {
      return ref
        .where('completionState', "in", 
        [
          CompletionState.pending,
          CompletionState.traderAccepted,
          CompletionState.avialable
        ]);
    });
  }

  getJobsForUser(uid: string) {
    return this.jobCollection = this.afirestore.collection('jobs', ref => ref.where('issueUid', '==', uid));
  }

  updateJob(job: Job) {
    return of(this.afirestore.doc<Job>(`jobs/${job.id}`).update(job))
  }

  setQuote(job: Job, quote: Quote) {
    job.quote.push(Object.assign({}, quote));
    return of(this.afirestore.doc<Job>(`jobs/${job.id}`).update(job))
  }

  setAcceptedJob(job: Job, uid: string) {
    job.workCandidates.push({uid: uid, completionState: CompletionState.traderAccepted})
    return of(this.afirestore.doc<Job>(`jobs/${job.id}`).update(job));
  }

  errorHandler(error) {
    console.log(error);
  }
}

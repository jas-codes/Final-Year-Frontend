import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Job } from '../models/job';
import { of } from 'rxjs/internal/observable/of';
import { CompletionState } from '../enums/completionState';
import { Quote } from '../models/quote';
import { QuotesService } from './quotes.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  jobCollection: AngularFirestoreCollection<Job>;

  constructor(
    private afirestore: AngularFirestore,
    private quoteService: QuotesService
  ) { }

  uploadNewJob(job: Job) {
    job.id = this.afirestore.createId();
    return of(this.afirestore.collection('jobs')
      .doc(job.id)
      .set({ ...job })
      .catch(error => this.errorHandler(error))
    );
  }

  getJobs() {
    return this.afirestore.collection('jobs');
  }


  getMapJobs() {
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

  getJobsByIds(jobIds: string[]) {
    return this.jobCollection = this.afirestore.collection('jobs', ref => 
      {
        return ref
          .where('id', 'in', jobIds)
      });
  }

  //get the jobs for a trader based on their qutoes and completionstates
  //Using maps to be able to return nested observables
  getJobsQuotedByTrader(traderUid: string) {
    return this.quoteService.getQuotesForTrader(traderUid).pipe( //get the quotes for the trader
      map(quotesCollection => { //map that collection to get data
        return quotesCollection.valueChanges().pipe(
          map(quotes => {
            let jobIds = quotes.map(quote => quote.jobId);  //get the job ids from that
            return this.getJobsByIds(jobIds); //get the jobs 
          })
        );
      })
    )
  }

  updateJob(job: Job) {
    return of(this.afirestore.doc<Job>(`jobs/${job.id}`).update(job)
      .catch(error => this.errorHandler(error)));
  }

  setAcceptedJob(job: Job, uid: string) {
    job.workCandidates.push({ uid: uid, completionState: CompletionState.traderAccepted })
    return of(this.afirestore.doc<Job>(`jobs/${job.id}`).update(job)
      .catch(error => this.errorHandler(error)));
  }

  errorHandler(error) {
    console.log(error);
  }
}

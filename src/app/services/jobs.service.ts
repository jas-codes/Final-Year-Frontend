import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Job } from '../models/job';
import { of } from 'rxjs/internal/observable/of';
import { CompletionState } from '../enums/completionState';
import { QuotesService } from './quotes.service';
import { map } from 'rxjs/operators';
import { FileUploadService } from './file-upload.service';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  jobCollection: AngularFirestoreCollection<Job>;

  constructor(
    private afirestore: AngularFirestore,
    private quoteService: QuotesService,
    private uploadService: FileUploadService
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

  getMapJobs() { //get jobs to only display on map
    return this.afirestore.collection<Job>('jobs', ref => {
      return ref
        .where('completionState', "in",
          [
            CompletionState.quoted,
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

  //get the jobs for a trader based on their quotes and completionstates
  //Using maps to be able to return nested observables
  getJobsQuotedByTrader(traderUid: string) {
    return this.quoteService.getQuotesForTrader(traderUid).pipe( //get the quotes for the trader
      map(quotesCollection => { //map that collection to get data
        return quotesCollection.valueChanges().pipe(
          map((quotes: any[]) => {
            let jobIds = quotes.map(quote => quote.jobId);
            if(jobIds.length > 0)  //get the job ids from that
              return this.getJobsByIds(jobIds); //get the jobs 
            else
              return undefined
          })
        );
      })
    )
  }

  getJobsAcceptedByTrader(traderUid: string) {
    return this.jobCollection = this.afirestore.collection<Job>('jobs', ref => {
      return ref
        .where('workCandidates', 'array-contains', traderUid)
    })
  }

  getJob(jobId: string) {
    return this.afirestore.doc<Job>(`jobs/${jobId}`);
  }

  updateJob(job: Job) {
    return of(this.afirestore.doc<Job>(`jobs/${job.id}`).update(job)
      .catch(error => this.errorHandler(error)));
  }

  setAcceptedJob(job: Job, uid: string) {
    job.workCandidates.push(uid)
    return of(this.afirestore.doc<Job>(`jobs/${job.id}`).update(job)
      .catch(error => this.errorHandler(error)));
  }

  //remove a trader from a jobs work candidates
  removeWorkCandidates(uid: string, workCandidates: string[]): any[] {
    var index = workCandidates.findIndex((candidateUid) => {
      return candidateUid == uid
    });

    if(index >= 0) { // convert to set for easier logic and faster
      var wcSet = new Set(workCandidates);
      wcSet.delete(workCandidates[index]);
      return Array.from(wcSet);
    }
    return workCandidates;
  }

  deleteJob(job: Job) {
    if(job.picture)
      this.uploadService.deleteFile(job.picture);
    this.afirestore.doc<Job>(`jobs/${job.id}`).delete();
  }

  errorHandler(error) {
    console.log(error);
  }
}

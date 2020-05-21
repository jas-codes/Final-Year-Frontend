import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Job } from 'src/app/models/job';
import { CompletionState } from 'src/app/enums/completionState';
import { JobsService } from 'src/app/services/jobs.service';
import { IUser } from 'src/app/services/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserTypes } from 'src/app/enums/user-types';
import { AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit, OnDestroy {
  @Input() listTypes: CompletionState[];
  private subscriptions: Subscription[] = [];
  jobCollection: AngularFirestoreCollection<Job>;

  searchTerm: string = "";
  jobs: Job[] = [];

  userSub: Subscription;
  user: IUser;

  constructor(
    private authService: AuthService,
    private jobsService: JobsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    if (this.authService.user$) {
      this.userSub = this.authService.user$.subscribe((user) => {
        this.user = user;

        if (this.user.accountType == UserTypes.trader) { //if trader
          this.getJobsForTrader();
        } else { //if you are a user get jobs
          this.getJobsForUser();
        }
      });
    }
  }

  //get the jobs a user owns
  getJobsForUser() {
    this.jobCollection = this.jobsService.getJobsForUser(this.user.uid);
    if (this.jobCollection) {
      this.subscriptions.push(this.jobCollection.valueChanges().subscribe((jobs) => {
        this.jobs = jobs
        if (jobs)
          this.filterJobs();
      }))
    }
  }

  getJobsForTrader() {
    //get the jobs based on the quotes and accepts the trader has made
    this.subscriptions.push(this.jobsService.getJobsQuotedByTrader(this.user.uid).subscribe((quotedJobsCollection) => {
      this.subscriptions.push(quotedJobsCollection.subscribe((jobsQuotedCollection) => {
        if (jobsQuotedCollection) {
          this.jobCollection = jobsQuotedCollection;
          this.subscriptions.push(this.jobCollection.valueChanges().subscribe((quotedJobs) => {
            if (quotedJobs)
              this.jobs = quotedJobs;
            this.filterJobs();
          }));
        }
      }));
    }));
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  //filter the components jobs by the handed in type
  filterJobs() {
    this.jobs = this.jobs.filter((job) => {
      if (this.listTypes.indexOf(job.completionState) >= 0)
        return true
      else
        return false
    })
  }

  //load a job
  loadJobDetails(id: number, index: number) {
    this.router.navigate([
      { outlets: { navLinks: ['my-jobs', id] } }
    ],
      { relativeTo: this.activatedRoute.parent, state: { data: this.jobs[index] } });
  }

}

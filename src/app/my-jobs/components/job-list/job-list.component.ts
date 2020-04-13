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
        
        if(this.user.accountType == UserTypes.trader) { //if trader

          //get the quotes, then get the jobs based on that
          this.jobsService.getJobsQuotedByTrader(user.uid).subscribe((quoteCollection) => {
            quoteCollection.subscribe((jobCollection) => {
              this.jobCollection = jobCollection;
              this.jobCollection.valueChanges().subscribe((jobs) => {
                this.jobs = jobs
                this.filterJobs(); //filter by completionStates
              })
            });
          });
        } else { //if you are a user get jobs
          this.jobCollection = this.jobsService.getJobsForUser(user.uid);
          this.jobCollection.valueChanges().subscribe((jobs) => {
            this.jobs = jobs
            this.filterJobs();
          })
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  filterJobs() {
    this.jobs = this.jobs.filter((job) => {
      if (this.listTypes.indexOf(job.completionState) >= 0)
        return true
      else 
        return false
    })
  }

  loadJobDetails(id: number, index: number){
    this.router.navigate([
      { outlets: { navLinks: ['my-jobs', id] } }
    ],
      { relativeTo: this.activatedRoute.parent, state: { data: this.jobs[index] } });
  }

}

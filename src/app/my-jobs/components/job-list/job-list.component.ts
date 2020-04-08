import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Job } from 'src/app/models/job';
import { CompletionState } from 'src/app/enums/completionState';
import { TradeType } from 'src/app/enums/trade-types';
import { JobsService } from 'src/app/services/jobs.service';
import { IUser } from 'src/app/services/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit, OnDestroy {
  @Input() listType: CompletionState;
  @Output() selectedJob = new EventEmitter<Job>();

  searchTerm: string = "";
  currentJobs: Job[] = [];
  pendingJobs: Job[] = [];
  userSub: Subscription;
  user: IUser;

  job: Job = {
    title: "Building a Wall Actively",
    completionState: CompletionState.active,
    address: "random address",
    conclusionDate: new Date(Date.now()),
    description: "i am a description",
    issueDate: new Date(Date.now()),
    lngLat: { lat: 50, lng: -4 },
    quote: 0,
    timeframe: "2 weeks",
    trade: TradeType.carpentry,
    postcode: "PL4 8PS",
    issueUid: '',
    budget: 1
  }

  job1: Job = {
    title: "Building a Wall Pendingly",
    completionState: CompletionState.pending,
    address: "random address",
    conclusionDate: new Date(Date.now()),
    description: "i am a description",
    issueDate: new Date(Date.now()),
    lngLat: { lat: 50, lng: -4 },
    quote: 0,
    timeframe: "2 weeks",
    trade: TradeType.carpentry,
    postcode: "PL4 8PS",
    issueUid: '',
    budget: 1
  }

  job2: Job = {
    title: "Building a Wall Historically",
    completionState: CompletionState.closed,
    address: "random address",
    conclusionDate: new Date(Date.now()),
    description: "i am a description",
    issueDate: new Date(Date.now()),
    lngLat: { lat: 50, lng: -4 },
    quote: 0,
    timeframe: "2 weeks",
    trade: TradeType.carpentry,
    postcode: "PL4 8PS",
    issueUid: '',
    budget: 1
  }

  constructor(
    private authService: AuthService,
    private jobsService: JobsService
  ) { }

  ngOnInit(): void {
    if (this.authService.user$) {
      this.userSub = this.authService.user$.subscribe((user) => {
        this.user = user;
        
        this.jobsService.getJobsForUser(this.user.uid).valueChanges().subscribe((jobs) => {
          console.log(jobs);
          this.currentJobs = jobs.filter(job => job.completionState == this.listType);
        });
      });
    }


    this.currentJobs.push(this.job);
    this.currentJobs.push(this.job);
    this.currentJobs.push(this.job1);
    this.currentJobs.push(this.job1);
    this.currentJobs.push(this.job2);
    this.currentJobs.push(this.job2);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  select(job) {
    this.selectedJob.emit(job);
  }

}

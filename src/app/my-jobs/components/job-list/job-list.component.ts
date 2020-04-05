import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Job } from 'src/app/models/job';
import { CompletionState } from 'src/app/enums/completionState';
import { TradeType } from 'src/app/enums/trade-types';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  @Input() listType: CompletionState;
  @Output() selectedJob = new EventEmitter<Job>();
  
  searchTerm: string = "";
  currentJobs: Job[] = [];
  pendingJobs: Job[] = [];

  job: Job = {
    title: "Building a Wall Actively",
    completionState: CompletionState.active,
    address: "random address",
    conclusionDate: new Date(Date.now()) ,
    description: "i am a description",
    issueDate: new Date(Date.now()),
    lngLat: {lat: 50, lng: -4},
    quote: 0,
    timeframe: "2 weeks",
    trade: TradeType.carpentry,
    postcode:"PL4 8PS",
    issueUid: '',
    budget: 1
  }

  job1: Job = {
    title: "Building a Wall Pendingly",
    completionState: CompletionState.pending,
    address: "random address",
    conclusionDate: new Date(Date.now()) ,
    description: "i am a description",
    issueDate: new Date(Date.now()),
    lngLat: {lat: 50, lng: -4},
    quote: 0,
    timeframe: "2 weeks",
    trade: TradeType.carpentry,
    postcode:"PL4 8PS",
    issueUid: '',
    budget: 1
  }

  job2: Job = {
    title: "Building a Wall Historically",
    completionState: CompletionState.closed,
    address: "random address",
    conclusionDate: new Date(Date.now()) ,
    description: "i am a description",
    issueDate: new Date(Date.now()),
    lngLat: {lat: 50, lng: -4},
    quote: 0,
    timeframe: "2 weeks",
    trade: TradeType.carpentry,
    postcode:"PL4 8PS",
    issueUid: '',
    budget: 1
  }

  constructor() { }

  ngOnInit(): void {
    this.currentJobs.push(this.job);
    this.currentJobs.push(this.job);
    this.currentJobs.push(this.job1);
    this.currentJobs.push(this.job1);
    this.currentJobs.push(this.job2);
    this.currentJobs.push(this.job2);
  }

  select(job) {
    this.selectedJob.emit(job);
  }

}

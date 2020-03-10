import { Component, OnInit } from '@angular/core';
import { Job } from '../models/job';
import { CompletionState } from '../enums/completionState';
import { TradeType } from '../enums/trade-types';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent implements OnInit {
  searchTerm: string = "";
  currentJobs: Job[] = [];
  pendingJobs: Job[] = [];
  selectedJob: Job;

  job: Job = {
    title: "Building a Wall",
    completionState: CompletionState.active,
    address: "random address",
    conclusionDate: new Date(Date.now()) ,
    description: "i am a description",
    issueDate: new Date(Date.now()),
    lngLat: new google.maps.LatLng(50,-4),
    quote: 0,
    timeframe: "2 weeks",
    trade: TradeType.carpentry,
    postcode:"PL4 8PS",

  }

  constructor() { }

  ngOnInit(): void {
    this.currentJobs.push(this.job);
    this.currentJobs.push(this.job);
    this.currentJobs.push(this.job);
  }

  selectJob(job) {
    this.selectJob = job
  }

}

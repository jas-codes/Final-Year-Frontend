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
  selectedJob: Job;
  currentJobList: CompletionState = CompletionState.active;
  pendingJobList: CompletionState = CompletionState.pending;

  constructor() { }

  ngOnInit(): void {
  }

  setJob(job) {
    this.selectedJob = job
  }

}

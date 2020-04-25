import { Component, OnInit } from '@angular/core';
import { Job } from '../models/job';
import { CompletionState } from '../enums/completionState';

@Component({
  selector: 'app-job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.css']
})
export class JobHistoryComponent implements OnInit {
  selectedJob: Job;
  historicalJobList: CompletionState = CompletionState.closed;

  constructor() { }

  ngOnInit(): void {
  }

  setJob(job){
    console.log(job);
    this.selectedJob = job;
  }

}

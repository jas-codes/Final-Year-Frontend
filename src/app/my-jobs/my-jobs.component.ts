import { Component, OnInit } from '@angular/core';
import { Job } from '../models/job';
import { CompletionState } from '../enums/completionState';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent implements OnInit {
  currentJobList: CompletionState[] = [CompletionState.active];
  pendingJobList: CompletionState[] = [CompletionState.pending, CompletionState.traderAccepted];

  constructor() { }

  ngOnInit(): void { }

}

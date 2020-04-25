import { Component, OnInit } from '@angular/core';
import { Job } from '../models/job';
import { CompletionState } from '../enums/completionState';
import { AuthService } from '../services/auth.service';
import { IUser } from '../services/user.model';
import { Subscription } from 'rxjs';
import { UserTypes } from '../enums/user-types';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent implements OnInit {
  currentJobList: CompletionState[] = [CompletionState.active];
  quotedJobList: CompletionState[] = [CompletionState.quoted, CompletionState.traderAccepted];
  availableJobList: CompletionState[] = [CompletionState.avialable];
  showAvailableList: boolean = false;

  userSub: Subscription;
  user: IUser;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.user$) {
      this.userSub = this.authService.user$.subscribe((user) => {
        this.user = user;
        if(this.user.accountType == UserTypes.user) {
          this.showAvailableList = true;
        }
      });
    }
  }

}

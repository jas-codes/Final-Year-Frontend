import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TradeType } from 'src/enums/trade-types';


@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.css']
})
export class NewJobComponent implements OnInit {
  @Output() dismiss = new EventEmitter<boolean>();
  trades = Object.values(TradeType);
  postcodeValue: string;
  jobDescriptionValue: string;
  budgetValue: string;

  constructor() { }

  ngOnInit(): void {
  }

  dismissComponent() {
    this.dismiss.emit(true);
  }

}

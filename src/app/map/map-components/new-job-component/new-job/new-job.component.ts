import { Component, OnInit } from '@angular/core';
import { TradeType } from 'src/enums/trade-types';


@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.css']
})
export class NewJobComponent implements OnInit {

  trades = Object.values(TradeType);
  postcodeValue:string;

  constructor() { }

  ngOnInit(): void {
  }

}

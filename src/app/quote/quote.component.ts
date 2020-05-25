import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JobsService } from '../services/jobs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent {
  //event emitters from component
  @Output() quote = new EventEmitter<number>();
  @Output() dismiss = new EventEmitter<boolean>();
  @Input() traderUid: string = '';
  
  noQuotesSubscription: Subscription;
  collectionSubscription: Subscription;
  valueChangesSubscription: Subscription;
  quoteLimit = 10;
  numberOfQuotes = 0;
  minimumQuote = 1;
  showQuoteLimit: boolean = false;

  form = new FormGroup({
    quote: new FormControl('', [Validators.required, Validators.min(this.minimumQuote)])
  });

  constructor(private jobsService: JobsService) { }

  ngOnInit(): void {
    if(this.traderUid) {
      this.noQuotesSubscription = this.jobsService.getJobsQuotedByTrader(this.traderUid).subscribe((response) => {
        if(response) {
          this.collectionSubscription = response.subscribe(collection => {
            if(collection){
              this.valueChangesSubscription = collection.valueChanges().subscribe((jobs) => {
                if(jobs){
                  if(jobs.length >= this.quoteLimit)
                    this.showQuoteLimit = true;
                }
              })
            }
          })
        }
      })
    }
    
  }

  registerQuote() { //emit quote event
    if(this.form.get('quote').value != '')
      this.quote.emit(this.form.get('quote').value);
    else 
      this.quote.emit(this.minimumQuote);
    this.dismissComponent()
  }

  dismissComponent() {
    this.dismiss.emit(true);
  }  
}

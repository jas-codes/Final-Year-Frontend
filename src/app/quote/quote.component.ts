import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent {
  //event emitters from component
  @Output() quote = new EventEmitter<number>();
  @Output() dismiss = new EventEmitter<boolean>();

  minimumQuote = 1;

  form = new FormGroup({
    quote: new FormControl('', [Validators.required, Validators.min(this.minimumQuote)])
  });

  constructor() { }

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

import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent {
  @Output() quote = new EventEmitter<number>();
  @Output() dismiss = new EventEmitter<boolean>();

  minimumQuote = 1;

  form = new FormGroup({
    quote: new FormControl('', [Validators.required, Validators.min(this.minimumQuote)])
  });

  constructor() { }

  registerQuote() {
    this.quote.emit(this.form.get('quote').value);
    this.dismissComponent()
  }

  dismissComponent() {
    this.dismiss.emit(true);
  }  
}

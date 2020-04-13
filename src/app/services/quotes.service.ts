import { Injectable } from '@angular/core';
import { Quote } from '../models/quote';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  constructor(
    private afireStore: AngularFirestore
  ) { }

  createQuote(quote: Quote) {
    quote.id = this.afireStore.createId();
    return of(this.afireStore.doc<Quote>(`quotes/${quote.id}`).set({...quote})
      .catch(error => this.errorHandler(error)));
  }

  getQuotesForTrader(traderUid: string){
    return of(this.afireStore.collection<Quote>('quotes', ref => {
      return ref
        .where('traderUid', '==', traderUid)
    }));
  }

  errorHandler(error) {
    console.log(error);
  }
}

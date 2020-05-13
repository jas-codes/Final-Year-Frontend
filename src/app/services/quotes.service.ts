import { Injectable } from '@angular/core';
import { Quote } from '../models/quote';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  quotesCollection: AngularFirestoreCollection<Quote>

  constructor(
    private afireStore: AngularFirestore,
  ) { }

  createQuote(quote: Quote) {
    quote.id = this.afireStore.createId();
    return of(this.afireStore.doc<Quote>(`quotes/${quote.id}`).set({ ...quote })
      .catch(error => this.errorHandler(error)));
  }

  getQuotesForTrader(traderUid: string) {
    return of(this.afireStore.collection<Quote>('quotes', ref => {
      return ref
        .where('traderUid', '==', traderUid)
    }));
  }

  getQuotesForJob(jobId: string) {
    return this.quotesCollection = this.afireStore.collection<Quote>('quotes', ref => {
      return ref
        .where('jobId', '==', jobId);
    })
  }

  createOrUpdateQuote(quote: Quote) {
    return this.getQuoteByTrader(quote.traderUid, quote.jobId).get().pipe(
      map((quotesSnapshot) => {
        if (quotesSnapshot.docs[0]) {// if there is already a quote, maintain that
          quote.id = quotesSnapshot.docs[0].id;
          this.updateQuote(quote);
          return true
        }
        else {
          return false;
        }
      })
    );
  }

  getQuoteByTrader(traderUid: string, jobId: string) {
    return this.quotesCollection = this.afireStore.collection<Quote>('quotes', ref => {
      return ref
        .where('traderUid', '==', traderUid)
        .where('jobId', '==', jobId);
    });
  }

  updateQuote(quote: Quote) {
    this.afireStore.doc<Quote>(`quotes/${quote.id}`).update({ ...quote }).catch(error => this.errorHandler(error))
  }

  deleteQuote(id: string) {
    this.afireStore.doc<Quote>(`quotes/${id}`).delete();
  }

  removeQuoteFromJob(quotesList: Quote[], jobQuotes: string[], uid:string): string[] {
    var quote = quotesList.find((quote) => { //find the users quote in the quoteList
      return quote.traderUid == uid
    })

    if (quote) {
      let quoteId = quote.id;
      var quoteSet = new Set(jobQuotes); //create set as easier to work with
      quoteSet.delete(quoteId); //delete from set

      this.deleteQuote(quoteId); //delete quote from server
      return Array.from(quoteSet);
    }
    return jobQuotes;
  }

  deleteAllQuotesFromJob(jobId: string) {
    this.quotesCollection = this.afireStore.collection<Quote>('quotes', ref => {
      return ref
        .where('jobId', '==', jobId)
    })

    this.quotesCollection.valueChanges().subscribe((quotes) => {
      quotes.forEach(quote => {
        this.deleteQuote(quote.id);
      });
    });
  }

  errorHandler(error) {
    console.log(error);
  }
}

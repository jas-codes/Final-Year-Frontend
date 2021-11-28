import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Review } from 'src/app/models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  
  constructor(private afirestore: AngularFirestore) { }

  postReview(review: Review) {
    let id = this.afirestore.createId();
    this.afirestore.collection('reviews').doc(id).set({...review});
  }

}

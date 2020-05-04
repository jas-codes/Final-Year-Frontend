import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Review } from '../models/review';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @Output() dismiss = new EventEmitter<boolean>();
  @Output() review = new EventEmitter<Review>();

  reviewRange = { max: 5, min: 1 };
  commentMaxLength: number = 300;

  reviewForm = new FormGroup({
    comment: new FormControl('', [Validators.maxLength(this.commentMaxLength)]),
    score: new FormControl('', [Validators.max(this.reviewRange.max), Validators.min(this.reviewRange.min)])
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    let review = new Review();
    review.comment = this.reviewForm.get('comment').value;
    review.score = parseInt(this.reviewForm.get('score').value);
    this.review.emit(review);
  }

  dismissComponent() {
    this.dismiss.emit(true);
  } 
}

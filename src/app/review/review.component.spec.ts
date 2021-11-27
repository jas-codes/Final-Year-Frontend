import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReviewComponent } from './review.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Review } from '../models/review';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewComponent ],
      providers: [
        {provide: AngularFirestore, useValue: AngularFirestoreMock}
      ],
      imports: [
        ReactiveFormsModule, FormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('event emitter tests', () => {
    it('should emit dismiss event', () => {
      spyOn(component.dismiss, 'emit');
      component.dismissComponent();
      expect(component.dismiss.emit).toHaveBeenCalledWith(true);
    });

    it('should emit review event', () => {
      spyOn(component.review, 'emit');

      component.onSubmit();
      let review = new Review();
      review.score = NaN;

      expect(component.review.emit).toHaveBeenCalledWith(review);
    });
  });
});

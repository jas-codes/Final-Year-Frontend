import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewComponent } from './review.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreMock } from '../testing/angular-firestore-mock';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;

  beforeEach(async(() => {
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
});

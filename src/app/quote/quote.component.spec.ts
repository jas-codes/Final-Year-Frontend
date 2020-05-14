import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteComponent } from './quote.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Quote } from '../models/quote';

describe('QuoteComponent', () => {
  let component: QuoteComponent;
  let fixture: ComponentFixture<QuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteComponent ],
      imports: [
        ReactiveFormsModule, FormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteComponent);
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
    })

    it('should emit quote event', () => {
      spyOn(component.quote, 'emit');
      component.registerQuote();
      expect(component.quote.emit).toHaveBeenCalledWith(1);
    })
  })
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyDetailsComponent } from './company-details.component';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Company } from '../models/company';

describe('CompanyDetailsComponent', () => {
  let component: CompanyDetailsComponent;
  let fixture: ComponentFixture<CompanyDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDetailsComponent ],
      providers: [

      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    var company = new Company();
    company.photos = ['picture1', 'picture2', 'picture3', 'picture4'];
    component.company = company;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const testCases = [
    {input: 1, expected: 1},
    {input: 0, expected: 0},
    {input: -1, expected: 0},
    {input: 5, expected: 0},
    {input: 3, expected: 3}
  ]
  testCases.forEach((testCase, index) => it(`should decrement or increment image index pointer by ${testCase.input} and produce result ${testCase.expected} (test case: ${index})`, () => {
    component.positiveIncrement = 1;
    component.negativeIncrement = -1;
    component.imageArrayIndex = 0;

    component.moveImageIndex(testCase.input);
    expect(testCase.expected).toEqual(component.imageArrayIndex);
  }));
});

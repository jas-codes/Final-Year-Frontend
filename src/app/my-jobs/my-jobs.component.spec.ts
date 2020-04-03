import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJobsComponent } from './my-jobs.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MyJobsComponent', () => {
  let component: MyJobsComponent;
  let fixture: ComponentFixture<MyJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyJobsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsComponent } from './chats.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ChatsComponent', () => {
  let component: ChatsComponent;
  let fixture: ComponentFixture<ChatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

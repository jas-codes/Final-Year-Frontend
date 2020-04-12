import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListComponent } from './chat-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChatListPipe } from 'src/app/pipes/chat-list.pipe';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthMock } from 'src/app/testing/angular-fire-auth-mock';
import { AngularFirestoreMock } from 'src/app/testing/angular-firestore-mock';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { AuthServiceMock } from 'src/app/testing/auth-service-mock';

describe('ChatListComponent', () => {
  let component: ChatListComponent;
  let fixture: ComponentFixture<ChatListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatListComponent, ChatListPipe ],
      imports: [ ReactiveFormsModule, FormsModule, RouterTestingModule

      ],
      providers: [
        { provide: AuthService, useValue: AuthServiceMock},
        {provide: AngularFirestore, useValue: AngularFirestoreMock},
        HttpHandler,
        HttpClient
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

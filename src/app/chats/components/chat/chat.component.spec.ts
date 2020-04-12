import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreMock } from 'src/app/testing/angular-firestore-mock';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthServiceMock } from 'src/app/testing/auth-service-mock';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from '../../services/chat.service';
import { ChatServiceMock } from 'src/app/testing/chat-service-mock';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatComponent ],
      providers: [
        {provide: AuthService, useValue: AuthServiceMock},
        {provide: AngularFirestore, useValue: AngularFirestoreMock},
        { provide: ChatService, useValue: ChatServiceMock },
        RouterTestingModule,
        HttpClient,
        HttpHandler
      ],
      imports: [ ReactiveFormsModule, FormsModule, RouterTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

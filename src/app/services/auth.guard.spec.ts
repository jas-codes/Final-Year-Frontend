import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AngularFireAuthMock } from '../testing/angular-fire-auth-mock';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthServiceMock } from '../testing/auth-service-mock';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: AngularFireAuth, useValue: AngularFireAuthMock},
        {provide: AuthService, useValue: AuthServiceMock}
      ],
      imports: [
        RouterTestingModule
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

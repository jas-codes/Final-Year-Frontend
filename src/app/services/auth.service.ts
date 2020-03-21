import { Injectable, NgZone } from '@angular/core';
import { User } from './user.model';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore,  AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private afireAuth: AngularFireAuth,
    private afirestore: AngularFirestore,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.user$ = this.afireAuth.authState.pipe(
      switchMap(user => {
        //logged in user
        if(user) {
          return this.afirestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          //logged out user
          return of(null);
        }
      })
    );
  }

  private updateUserInfo(user) {
    const userRef: AngularFirestoreDocument<User> = this.afirestore.doc(`users/${user.uid}`);
    const data = {
      uid: user.uid,
      email : user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, {merge: true})
  }

  async googleSignin() {
    var self = this;

    const provider = new auth.GoogleAuthProvider();
    await this.afireAuth.auth.signInWithPopup(provider).then(function(result) {
      //successful login
      self.updateUserInfo(result.user);
      self.ngZone.run(() =>  self.router.navigate(['/home']));
    }).catch(error => this.errorCatch(error));
  }

  async facebookSignin() {
    var self = this;

    const provider = new auth.FacebookAuthProvider();
    await this.afireAuth.auth.signInWithPopup(provider).then(function(result) {
      //successful login
      self.updateUserInfo(result.user);
    }).catch(error => this.errorCatch(error));;

  }

  async githubSignin() {
    var self = this;

    const provider = new auth.GithubAuthProvider();
    await this.afireAuth.auth.signInWithPopup(provider).then(function(result) {
      //successful login
      self.updateUserInfo(result.user);
    }).catch(error => this.errorCatch(error));
  }

  async microsoftSignin() {
    var self = this;

    const provider = new auth.OAuthProvider('microsoft.com');
    await this.afireAuth.auth.signInWithPopup(provider).then(function(result) {
      //successful login
      self.updateUserInfo(result.user);
    }).catch(error => this.errorCatch(error));    
  }

  async emailAndPasswordSignin(email, password) {
    var self = this;
    this.afireAuth.auth.signInWithEmailAndPassword(email, password).then(function(result) {
      //successful Login
      self.updateUserInfo(result.user);
    }).catch(error => this.errorCatch(error));        
  }

  async createAccount(email, password) {
    var self = this;
    this.afireAuth.auth.createUserWithEmailAndPassword(email, password).then(function(result) {
      //successful account creation
      self.updateUserInfo(result.user); 
    }).catch(error => this.errorCatch(error));
  }

  async signOut() {
    await this.afireAuth.auth.signOut().then(function() {
      this.router.navigate(['/']);
    }).catch(error => this.errorCatch(error));
  }

  errorCatch(error) {
      //metadata
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = "";
      var credential = "";

      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      }

      if(error.email)
        email = error.email;
      //type of auth
      if(error.credential)
        credential = error.credential;

      console.error('auth error - logged with analytics');
  }
}

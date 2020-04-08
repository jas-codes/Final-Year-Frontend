import { Injectable, NgZone } from '@angular/core';
import { IUser } from './user.model';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore,  AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { UserTypes } from '../enums/user-types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<IUser>;
  user: IUser;

  constructor(
    private afireAuth: AngularFireAuth,
    private afirestore: AngularFirestore,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.registerUserObservable()
  }

  registerUserObservable() {
    this.user$ = this.afireAuth.authState.pipe(
      switchMap(user => {
        //logged in user
        if(user) {
          return this.afirestore.doc<IUser>(`users/${user.uid}`).valueChanges();
        } else {
          //logged out user
          return of(null);
        }
      })
    );
  }

  getSignedInUser(){
    return this.afireAuth.auth.currentUser;
  }
  

  private updateUserInfo(user, form?: FormGroup, photoURL?: string) {
    const userRef: AngularFirestoreDocument<IUser> = this.afirestore.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email : user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      firstName: '',
      lastName: '',
      dob: new Date(null),
      postcode: '',
      accountType: '',
      companyName: '',
      tradeType: '',
    };

    if(form) {
      data.firstName = form.get('firstName').value;
      data.lastName = form.get('lastName').value;
      data.phoneNumber = form.get('phoneNumber').value;
      data.dob = form.get('dob').value;
      data.postcode = form.get('postcode').value;
      data.accountType = form.get('accountType').value;
      if(data.accountType == UserTypes.trader){
        data.companyName = form.get('companyName').value;
        data.tradeType = form.get('tradeType').value;
      }
      if(photoURL) {
        data.photoURL = photoURL;
      }
      if(form.get('nickname').value !== '') {
        data.displayName = form.get('nickname').value;
      }
    }

    return userRef.set(data, {merge: true})
  }

  uploadSignInDetails(form: FormGroup) {
      //successful login
      var user = this.afireAuth.auth.currentUser;
      if(user) {
        this.updateUserInfo(user, form).then(() => {
          this.ngZone.run(() =>  this.router.navigate(['home/']));
        });
      }
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    await this.afireAuth.auth.signInWithRedirect(provider);
  }

  async facebookSignin() {
    const provider = new auth.FacebookAuthProvider();
    await this.afireAuth.auth.signInWithRedirect(provider);
  }

  async githubSignin() {
    const provider = new auth.GithubAuthProvider();
    await this.afireAuth.auth.signInWithRedirect(provider);
  }

  async microsoftSignin() {
    const provider = new auth.OAuthProvider('microsoft.com');
    await this.afireAuth.auth.signInWithRedirect(provider);
  }

  async emailAndPasswordSignin(email, password) {
    var self = this;
    this.afireAuth.auth.signInWithEmailAndPassword(email, password)
      .catch(error => this.errorCatch(error));        
  }

  async createAccount(email, password, form: FormGroup, photoURL?) {
    var self = this;
    this.afireAuth.auth.createUserWithEmailAndPassword(email, password).then(function(result) {
      //successful account creation
      if(photoURL)
        self.updateUserInfo(result.user, form, photoURL); 
      else
        self.updateUserInfo(result.user, form);
      self.ngZone.run(() =>  self.router.navigate(['home/']));
    }).catch(error => this.errorCatch(error));
  }

  async signOut() {
    await this.afireAuth.auth.signOut().then(function() {
      window.location.href = '/';
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

      console.error('auth error - logged with analytics', error);
  }
}

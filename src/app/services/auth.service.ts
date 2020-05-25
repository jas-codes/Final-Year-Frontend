import { Injectable } from '@angular/core';
import { IUser } from './user.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { UserTypes } from '../enums/user-types';
import { CompaniesService } from './companies.service';
import { PostcodeService } from './postcode.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<IUser>;
  user: IUser;
  showError: boolean = false;

  constructor(
    private afireAuth: AngularFireAuth,
    private afirestore: AngularFirestore,
    private companyService: CompaniesService,
    private postcodeService: PostcodeService
  ) {
    this.registerUserObservable()
  }

  registerUserObservable() {
    this.user$ = this.afireAuth.authState.pipe(
      switchMap(user => {
        //logged in user
        if (user) {
          return this.afirestore.doc<IUser>(`users/${user.uid}`).valueChanges();
        } else {
          //logged out user
          return of(null);
        }
      })
    );
  }

  getSignedInUser() {
    return this.afireAuth.auth.currentUser;
  }


  //update user info with company creation also
  private updateUserInfoFromLogin(user, form?: FormGroup, photoURL?: string) {
    const userRef: AngularFirestoreDocument<IUser> = this.afirestore.doc(`users/${user.uid}`);
    if (photoURL)
      var data = this.updateData(user, form, photoURL);
    else
      var data = this.updateData(user, form, photoURL);

    this.postcodeService.convertPostcodeToLatLong(data.postcode).toPromise()
      .then((res) => {
        let lat = ((res as any).result.latitude);
        let lng = ((res as any).result.longitude);
        data.lngLat = { lat, lng };

        if (data.accountType == UserTypes.trader) { //create company if trader, on first login
          this.companyService.createCompany(form, data);
        }

        userRef.set(data, { merge: true })
      });
  }

  //update user info from anywhere
  public updateUserInfo(user, form: FormGroup, photoURL?: string) {
    const userRef: AngularFirestoreDocument<IUser> = this.afirestore.doc(`users/${user.uid}`);
    if (photoURL)
      var data = this.updateData(user, form, photoURL);
    else
      var data = this.updateData(user, form, photoURL);

    this.postcodeService.convertPostcodeToLatLong(data.postcode).toPromise()
      .then((res) => {
        let lat = ((res as any).result.latitude);
        let lng = ((res as any).result.longitude);
        data.lngLat = { lat, lng };

        userRef.set(data, { merge: true })
      });
  }

  //update the data for a user
  updateData(user, form: FormGroup, photoURL?: string) {
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      firstName: '',
      lastName: '',
      dob: new Date(null),
      postcode: '',
      accountType: '',
      lngLat: undefined
    };

    data.firstName = form.get('firstName').value;
    data.lastName = form.get('lastName').value;
    data.phoneNumber = form.get('phoneNumber').value;
    data.postcode = form.get('postcode').value;

    //if this data is in the form
    if (form.get('emailAddress'))
      data.email = form.get('emailAddress').value;
    if (form.get('dob'))
      data.dob = form.get('dob').value;
    if (form.get('accountType'))
      data.accountType = form.get('accountType').value;
    if (photoURL)
      data.photoURL = photoURL;
    if (form.get('nickname').value !== '')
      data.displayName = form.get('nickname').value;

    return data;
  }

  uploadSignInDetails(form: FormGroup) {
    //successful login
    var user = this.afireAuth.auth.currentUser;
    if (user) {
      this.updateUserInfoFromLogin(user, form)
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

  async microsoftSignin() {
    const provider = new auth.OAuthProvider('microsoft.com');
    await this.afireAuth.auth.signInWithRedirect(provider);
  }

  async emailAndPasswordSignin(email, password) {
    this.afireAuth.auth.signInWithEmailAndPassword(email, password)
      .catch(error => this.errorCatch(error));
  }

  async createAccount(email, password, form: FormGroup, photoURL?) {
    var self = this;
    this.afireAuth.auth.createUserWithEmailAndPassword(email, password).then(function (result) {
      //successful account creation
      if (photoURL)
        self.updateUserInfoFromLogin(result.user, form, photoURL);
      else
        self.updateUserInfoFromLogin(result.user, form);
    }).catch(error => this.errorCatch(error));
  }

  async signOut() {
    await this.afireAuth.auth.signOut().then(function () {
      window.location.href = '/';
    }).catch(error => this.errorCatch(error));
  }

  errorCatch(error) {
    //metadata
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = "";
    var credential = "";

    if (errorCode === 'auth/wrong-password'|| errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-email') {
      console.log('hello')
      this.showError = true;
    }

    if (error.email)
      email = error.email;
    //type of auth
    if (error.credential)
      credential = error.credential;

    console.error('auth error - logged with analytics', error);
  }
}

import { Injectable } from '@angular/core';
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
    private router: Router
  ) {
    
    this.user$ = this.afireAuth.authState.pipe(
      switchMap(user => {
        console.log('in switchMap')
        //logged in user
        if(user) {
          return this.afirestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          console.log('should be null')
          //logged out user
          return of(null);
        }
      })
    )
  }

  private updateUserInfo(user) {
    const userRef: AngularFirestoreDocument<User> = this.afirestore.doc(`users/${user.uid}`);
    debugger;
    const data = {
      uid: user.uid,
      email : user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, {merge: true})
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afireAuth.auth.signInWithPopup(provider);
    return this.updateUserInfo(credential.user);
  }

  async signOut() {
    await this.afireAuth.auth.signOut();
    this.router.navigate(['/'])
  }
}

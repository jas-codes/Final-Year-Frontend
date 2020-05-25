import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  email: string = "";
  password: string = "";

  constructor(
    public authService: AuthService,
    private afireAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    //check if the user is signed in
    if (this.afireAuth.auth) {
      this.afireAuth.auth.getRedirectResult().then((result) => {
        //subscribe to result
        this.authService.user$.subscribe(user => {
          if (user) //accounts for possible difference with 3rd party auth
            this.checkUserDetailsComplete(user);
          else if (result.user) //accounts for possible difference with 3rd party auth
            this.checkUserDetailsComplete(result.user);
        });
      }).catch(error => this.errorCatch)
    }
  }

  navigateCreateAccount() {
    this.router.navigate(['create-account']);
  }

  checkUserDetailsComplete(user) {
    if (user.accountType) //if they have this property then its been done
      this.ngZone.run(() => this.router.navigate(['home/']));
    else
      this.ngZone.run(() => this.router.navigate(['create-account'], { queryParams: { signedIn: true } }));
  }

  errorCatch(error) {
    //metadata
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = "";
    var credential = "";

    if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-email') {
      console.log(errorCode);
    }

    if (error.email)
      email = error.email;
    //type of auth
    if (error.credential)
      credential = error.credential;

    console.error('auth error - logged with analytics', error);
  }
}

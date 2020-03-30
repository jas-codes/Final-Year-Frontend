import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';

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
    private router: Router,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    auth().getRedirectResult().then((result) => {
      this.authService.user$.subscribe(user => {
        if(user)
          this.checkUserDetailsComplete(user);
        else if(result.user)
          this.checkUserDetailsComplete(result.user);
      });
    }).catch(error => this.errorCatch)
  }

  navigateCreateAccount(){
    this.router.navigate(['create-account']);
  }

  checkUserDetailsComplete(user) {
    if(user.accountType)
      this.ngZone.run(() =>  this.router.navigate(['home']));
    else
      this.ngZone.run(() =>  this.router.navigate(['create-account'], {queryParams: {signedIn: true}}));
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

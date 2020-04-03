import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TradeType } from '../enums/trade-types';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserTypes } from '../enums/user-types';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploadService } from '../services/file-upload.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  trades = Object.values(TradeType);
  file: any;
  maxDate = new Date();
  trader: boolean = false;
  passwordMatch: boolean = true;
  photoURL: string;
  signInDetails: Observable<string>;
  signedInAlready: boolean;

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    nickname: new FormControl('', Validators.required),
    postcode: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
    companyName: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', Validators.required),
    tradeType: new FormControl(''),
    accountType: new FormControl('', Validators.required),
    dob: new FormControl('', Validators.required),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
  });


  constructor(
    private router: Router,
    private fileUploadService: FileUploadService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.maxDate.setDate(this.calcMaxDate());
    this.signInDetails = this.route
      .queryParamMap
      .pipe(map(params => params.get('signedIn') || 'false'));

    this.signInDetails.subscribe((res) => {
      if (res === 'true') {
        this.removeValidators('password');
        this.removeValidators('rePassword');
        this.removeValidators('nickname');
        this.removeValidators('emailAddress');
        this.signedInAlready = true;
      }
    });
  }

  calcMaxDate(): number {
    return (this.maxDate.getDate() - (365 * 18));
  }

  comparePasswords() {
    if (this.form.get('password').value !== '' || this.form.get('rePassword').value !== '')
      this.passwordMatch = (this.form.get('password').value === this.form.get('rePassword').value);
  }

  traderSelected(value) {
    if (value === UserTypes.trader) {
      this.trader = true;
      this.updateValidator('tradeType');
      this.updateValidator('companyName');
    }
    else {
      this.removeValidators('tradeType');
      this.removeValidators('companyName');
      this.trader = false;
    }
  }

  removeValidators(value) {
    this.form.get(value).clearValidators();
    this.form.get(value).updateValueAndValidity();
  }

  updateValidator(value) {
    this.form.get(value).setValidators(Validators.required);
    this.form.get(value).updateValueAndValidity();
  }

  onSubmit() {
    var self = this;
    if (!this.signedInAlready) {
      if (this.file) {
        this.fileUploadService.uploadFile(this.file, function (result) {
          if(result === 'error')
            console.log('there was an error with the upload');
          else {
            self.photoURL = result;
            self.authService.createAccount(self.form.get('emailAddress').value, self.form.get('password').value, self.form, self.photoURL);
          }
        });
      } else {
        self.authService.createAccount(self.form.get('emailAddress').value, self.form.get('password').value, self.form);
      }
    } else {
      this.authService.uploadSignInDetails(this.form);
    }
  }

  cancel() {
    this.router.navigate(['login']);
  }

  cancelDetails() {
    this.authService.signOut();
  }

  onClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      this.file = fileUpload.files;
    };
    fileUpload.click();
  }
}

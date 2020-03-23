import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TradeType } from '../enums/trade-types';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserTypes } from '../enums/user-types';
import { Router } from '@angular/router';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  trades = Object.values(TradeType);
  file: any;
  maxDate = new Date();
  trader: boolean = false;
  passwordMatch: boolean = true;

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    nickname: new FormControl('', Validators.required),
    postcode: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
    companyName: new FormControl(''),
    password: new FormControl('', Validators.required),
    rePassword: new FormControl('', Validators.required),
    tradeType: new FormControl(''),
    accountType: new FormControl('', Validators.required),
    dob: new FormControl('', Validators.required),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
  })


  constructor(
    private router: Router,
    private fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
    this.maxDate.setDate(this.calcMaxDate());
  }

  calcMaxDate(): number {
    return (this.maxDate.getDate() - (365 * 18))
  }

  comparePasswords() {
    if (this.form.get('password').value !== '' || this.form.get('rePassword').value !== '')
      this.passwordMatch = (this.form.get('password').value === this.form.get('rePassword').value);
  }

  addPicture() {

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
    console.log(this.form.value);
    console.log(this.file);
    debugger;
    this.fileUploadService.uploadFile(this.file);
  }

  cancel() {
    this.router.navigate(['login']);
  }

  onClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
        this.file = fileUpload.files;
      };
    console.log('here');
    fileUpload.click();
  }


}

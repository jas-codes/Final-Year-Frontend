import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription, pipe } from 'rxjs';
import { IUser } from '../services/user.model';
import { UserTypes } from '../enums/user-types';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileUploadService } from '../services/file-upload.service';
import { CompaniesService } from '../services/companies.service';
import { map, tap } from 'rxjs/operators';
import { ThemeConstants } from '../enums/theme-constants';
import { BlobLocations } from '../enums/blob-locations';
import { PostcodeService } from '../services/postcode.service';
import { TradeType } from '../enums/trade-types';
import { Company } from '../models/company';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.css']
})
export class MyPageComponent implements OnInit, OnDestroy {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  subscriptions: Subscription[] = [];
  file: any;
  editUserDetails: boolean = false;
  editCompanyDetails: boolean = false;
  userFormChange: boolean = false;
  userFormSubscription: Subscription;
  userSliderColour: string = ThemeConstants.accent;
  companySliderColour: string = ThemeConstants.accent;
  disabledUserForm: boolean = false;
  disabledCompanyForm: boolean = false;
  customErrorText: string = '';
  showCustomErrorUserInfo: boolean = false;
  trades = Object.values(TradeType);
  company: Company;

  //user variables
  userSub: Subscription;
  user: IUser;
  trader: boolean = false;

  userInfoForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    nickname: new FormControl('', Validators.required),
    postcode: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
    accountType: new FormControl(''),
    dob: new FormControl(''),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
  });

  companyInfoForm = new FormGroup({
    tradeType: new FormControl('', Validators.required),
    companyName: new FormControl('', Validators.required),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
  })

  constructor(private authService: AuthService,
    private fileUploadService: FileUploadService,
    private companyService: CompaniesService,
    private postcodeService: PostcodeService) { }

  ngOnInit(): void {
    this.userFormToggle();
    if (this.authService.user$) { //get the user
      this.userSub = this.authService.user$.subscribe((user) => {
        if (user != null) {
          this.user = user;
          if (this.user.accountType == UserTypes.trader) {
            this.trader = true;
            this.subscriptions.push(this.companyService.getCompanyByUid(this.user.uid).valueChanges().subscribe((company) => {
              console.log(company)
              this.company = company
              this.updateCompanyFormDefaults();
            }))
          }
          this.updateUserFormDefaults()
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onClickUserInfo() {
    var self = this;
    const fileUpload = this.fileUpload.nativeElement;

    fileUpload.onchange = () => {
      this.file = fileUpload.files;

      if (this.file) {
        this.fileUploadService.uploadFile(this.file, BlobLocations.profilePicture, function (result) {
          //callback once the photo is uploaded containing image URL
          if (result === 'error') {
            console.log('there was an error with the upload');
          } else {
            self.user.photoURL = result;
            self.authService.updateUserInfo(self.user, self.userInfoForm, result);
          }
        })
      }
    };
    fileUpload.click();
  }

  updateUserFormDefaults() {
    this.userInfoForm.get('firstName').setValue(this.user.firstName);
    this.userInfoForm.get('lastName').setValue(this.user.lastName);
    this.userInfoForm.get('nickname').setValue(this.user.displayName);
    this.userInfoForm.get('postcode').setValue(this.user.postcode);
    this.userInfoForm.get('phoneNumber').setValue(this.user.phoneNumber);
    this.userInfoForm.get('emailAddress').setValue(this.user.email);
    this.userInfoForm.get('dob').setValue(this.user.dob);
    this.userInfoForm.get('accountType').setValue(this.user.accountType);
    // this.form.get('').setValue(this.user);
  }

  updateCompanyFormDefaults() {
    this.companyInfoForm.get('companyName').setValue(this.company.companyName);
    this.companyInfoForm.get('tradeType').setValue(this.company.tradeType);
    this.companyInfoForm.get('emailAddress').setValue(this.company.email);
  }

  onFormChanges() {
    this.userFormSubscription = this.userInfoForm.valueChanges.subscribe((val) => {
      if (val)
        this.userFormChange = true;

      if (!this.userInfoForm.valid) {
        this.userSliderColour = ThemeConstants.warn;
        this.disabledUserForm = true;
      }
      else {
        this.checkPostcodeValidity();
      }
    });
  }

  userFormToggle() {
    if (!this.editUserDetails) {
      if (this.userFormSubscription)
        this.userFormSubscription.unsubscribe();
      if (this.userFormChange) {
        console.log('updating userinfo')
        this.authService.updateUserInfo(this.user, this.userInfoForm, this.user.photoURL);
      }

      this.checkPostcodeValidity()
      this.userInfoForm.disable();
      this.userFormChange = false;
    }
    else {
      this.userInfoForm.enable();
      this.onFormChanges();
    }
  }

  CompanyFormToggle() {

  }

  checkPostcodeValidity() {
    this.postcodeService.convertPostcodeToLatLong(this.userInfoForm.get('postcode').value).subscribe(
      (data) => {
        this.userSliderColour = ThemeConstants.accent;
        this.disabledUserForm = false;
        this.showCustomErrorUserInfo = false;
      },
      (error) => {
        if (this.editUserDetails) {
          console.log('here we are')
          this.customErrorText = 'Invalid Postcode'
          this.showCustomErrorUserInfo = true;
          this.userSliderColour = ThemeConstants.warn;
          this.disabledUserForm = true;
        }
      }
    )
  }

}

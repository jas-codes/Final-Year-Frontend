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
  @ViewChild("fileUploadUser", { static: false }) fileUploadUser: ElementRef;
  @ViewChild("fileUploadCompany", { static: false }) fileUploadCompany: ElementRef;
  subscriptions: Subscription[] = [];
  fileUserInfo: any;
  fileCompanyInfo: any;
  editUserDetails: boolean = false;
  editCompanyDetails: boolean = false;
  userFormChange: boolean = false;
  companyFormChange: boolean = false;
  userFormSubscription: Subscription;
  companyFormSubscription: Subscription;
  userSliderColour: string = ThemeConstants.accent;
  companySliderColour: string = ThemeConstants.accent;
  disabledUserForm: boolean = false;
  disabledCompanyForm: boolean = false;
  customErrorText: string = '';
  showCustomErrorUserInfo: boolean = false;
  trades = Object.values(TradeType);
  company: Company;
  descriptionMaxLength: number = 300;
  companyGallery: boolean = false;
  numberOfGalleryImages: number = 0;

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
    description: new FormControl('', Validators.maxLength(this.descriptionMaxLength))
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
              this.company = company
              this.numberOfGalleryImages = this.company.photos.length;
              this.CompanyFormToggle();
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

  onClickUserUpload() {
    var self = this;
    const fileUpload = this.fileUploadUser.nativeElement;

    fileUpload.onchange = () => {
      this.fileUserInfo = fileUpload.files;

      if (this.fileUserInfo) {
        this.fileUploadService.uploadFile(this.fileUserInfo, BlobLocations.profilePicture, function (result) {
          //callback once the photo is uploaded containing image URL
          if (result === 'error') {
            console.log('there was an error with the upload');
          } else {
            self.user.photoURL = result;
            self.authService.updateUserInfo(self.user, self.userInfoForm, result);
          }
        });
      }
    };
    fileUpload.click();
  }

  onClickCustomerUpload() {
    var self = this;
    const fileUpload = this.fileUploadCompany.nativeElement;

    fileUpload.onchange = () => {
      this.fileCompanyInfo = fileUpload.files;

      if(this.fileCompanyInfo) {
        this.fileUploadService.uploadFile(this.fileCompanyInfo, BlobLocations.companyImages, function(result) {
          if(result === 'error') {
            console.log('there was an error with the upload');
          } else {
            self.company.photos.push(result);
            self.companyService.updateCompany(self.company);
          }
        });
      }
    }
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
  }

  updateCompanyFormDefaults() {
    this.companyInfoForm.get('companyName').setValue(this.company.companyName);
    this.companyInfoForm.get('tradeType').setValue(this.company.tradeType);
    this.companyInfoForm.get('emailAddress').setValue(this.company.email);
    this.companyInfoForm.get('description').setValue(this.company.description);
  }

  onUserFormEdit() {
    this.userFormSubscription = this.userInfoForm.valueChanges.subscribe((val) => {
      if (val)
        this.userFormChange = true;

      if (!this.userInfoForm.valid) {
        this.userSliderColour = ThemeConstants.warn;
        this.disabledUserForm = true;
      }
      else
        this.checkPostcodeValidity();
    });
  }

  onCompanyFormEdit() {
    this.companyFormSubscription = this.companyInfoForm.valueChanges.subscribe((val) => {
      if (val)
        this.companyFormChange = true;

      if (!this.companyInfoForm.valid) {
        this.companySliderColour = ThemeConstants.warn;
        this.disabledCompanyForm = true;
      }
      else {
        this.companySliderColour = ThemeConstants.accent;
        this.disabledCompanyForm = false;
      }

    })
  }

  userFormToggle() {
    if (!this.editUserDetails) {
      if (this.userFormSubscription)
        this.userFormSubscription.unsubscribe();
      if (this.userFormChange) {
        this.authService.updateUserInfo(this.user, this.userInfoForm, this.user.photoURL);
      }

      this.userInfoForm.disable();
      this.userFormChange = false;
    }
    else {
      this.userInfoForm.enable();
      this.onUserFormEdit();
    }
  }

  CompanyFormToggle() {
    if (!this.editCompanyDetails) {
      if (this.companyFormSubscription)
        this.companyFormSubscription.unsubscribe()
      if (this.companyFormChange)
        this.makeChangesToCompany();
      this.companyInfoForm.disable();
      this.companyFormChange = false;
    } else {
      this.companyInfoForm.enable();
      this.onCompanyFormEdit();
    }
  }

  checkPostcodeValidity() {
    var subscription = this.postcodeService.convertPostcodeToLatLong(this.userInfoForm.get('postcode').value).subscribe(
      (data) => {
        this.userSliderColour = ThemeConstants.accent;
        this.disabledUserForm = false;
        this.showCustomErrorUserInfo = false;
        subscription.unsubscribe();
      },
      (error) => {
        if (this.editUserDetails) {
          this.customErrorText = 'Invalid Postcode'
          this.showCustomErrorUserInfo = true;
          this.userSliderColour = ThemeConstants.warn;
          this.disabledUserForm = true;
          subscription.unsubscribe();
        }
      }
    )
  }

  makeChangesToCompany() {
    this.company.email = this.companyInfoForm.get('emailAddress').value;
    this.company.companyName = this.companyInfoForm.get('companyName').value;
    this.company.tradeType = this.companyInfoForm.get('tradeType').value;
    this.company.description = this.companyInfoForm.get('description').value;
    this.companyService.updateCompany(this.company);
  }

  showCompanyGallery() {
    this.companyGallery = !this.companyGallery;
  }
}

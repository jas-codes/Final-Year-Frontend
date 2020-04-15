import { Component, OnInit, Output, EventEmitter, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { TradeType } from 'src/app/enums/trade-types';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/services/user.model';
import { Subscription } from 'rxjs';
import { PostcodeService } from 'src/app/services/postcode.service';
import { Job } from 'src/app/models/job';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { BlobLocations } from 'src/app/enums/blob-locations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JobsService } from 'src/app/services/jobs.service';
import { CompletionState } from 'src/app/enums/completionState';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.css']
})
export class NewJobComponent implements OnInit, OnDestroy {
  //component variables
  @Output() dismiss = new EventEmitter<boolean>();
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  file: File;
  trades = Object.values(TradeType);
  newJob: Job = new Job();
  timeframeDuration: string = 'Days';

  //validation variables
  minimunPrice = 50;
  maxDesicriptionLength = 300;
  maxTitleLength = 30
  minPostcodeLength = 6;
  maxPostcodeLength = 8;
  customErrorText = '';
  postcodeInvalid: boolean;
  uploadError: boolean;

  //user variables
  private userSub: Subscription;
  user: IUser;
  
  //form and validators
  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(this.maxTitleLength)]),
    postcode: new FormControl('', [Validators.required, Validators.maxLength(this.maxPostcodeLength), Validators.minLength(this.minPostcodeLength)]),
    tradeType: new FormControl('', Validators.required),
    budget: new FormControl('', [Validators.required, Validators.min(this.minimunPrice)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(this.maxDesicriptionLength)]),
    timeframe: new FormControl('', [Validators.required, Validators.min(1)])
  });

  constructor(
    public authService: AuthService,
    private postcodeService: PostcodeService,
    public fileUploadService: FileUploadService,
    private jobsService: JobsService
  ) { }

  ngOnInit(): void {
    if (this.authService.user$) { //get user
      this.userSub = this.authService.user$.subscribe((user) => {
        this.user = user;
        this.newJob.issueUid = user.uid;
      });
    }
  }

  //set postcode to false
  postcodeChange() {
    this.postcodeInvalid = false;
  }

  //submit form and image currently... need to move image upload to independent
  submit() {
    var self = this;
    this.newJob.issueDate = Date.now();
    this.newJob.timeframe += ' ' + this.timeframeDuration;
    //check postcode validity and converto to LatLng for google maps
    this.postcodeService.convertPostcodeToLatLong(this.form.get('postcode').value).subscribe(
      (data) => {
        let lat = ((data as any).result.latitude);
        let lng = ((data as any).result.longitude);
        this.newJob.lngLat = { lat, lng }
        this.newJob.completionState = CompletionState.avialable;

        if (this.file) { //if a photo, upload it to blob, else post job
          this.fileUploadService.uploadFile(this.file, BlobLocations.jobPostingImages, function (result) {
            //callback once the photo is uploaded containing image URL
            if (result === 'error') {
              console.log('there was an error with the upload');
              self.customErrorText = "Problem with Image Upload";
              self.uploadError = true;
            }
            else { //post job
              self.newJob.picture = result;
              self.jobsService.uploadNewJob(self.newJob).toPromise().then(() => self.dismissComponent());
            }
          });
        } else { 
          this.jobsService.uploadNewJob(this.newJob).toPromise().then(() => self.dismissComponent());
        }
      },
      (error) => this.errorHandler(error)
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  //error handler
  errorHandler(error) {
    if (error.error.error == 'Invalid postcode') {
      this.postcodeInvalid = true;
      this.customErrorText = 'Invalid Postcode';
    }
    console.log("oops", error);
  }

  dismissComponent() {
    this.dismiss.emit(true);
  }

  //onclick to open file explorer
  onClick() {
    this.uploadError = false;
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      this.file = fileUpload.files;
    };
    fileUpload.click();
  }
}

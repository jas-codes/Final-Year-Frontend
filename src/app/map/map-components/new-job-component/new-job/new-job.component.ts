import { Component, OnInit, Output, EventEmitter, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { TradeType } from 'src/app/enums/trade-types';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/user.model';
import { Subscription } from 'rxjs';
import { PostcodeService } from 'src/app/services/postcode.service';
import { Job } from 'src/app/models/job';
import { LatLon } from 'src/app/models/lat-lon';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { BlobLocations } from 'src/app/enums/blob-locations';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.css']
})
export class NewJobComponent implements OnInit, OnDestroy {
  @Output() dismiss = new EventEmitter<boolean>();
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  private userSub: Subscription;

  trades = Object.values(TradeType);
  postcodeValue: string;
  jobDescriptionValue: string;
  budgetValue: string;
  user: User;
  file: File;

  newJob: Job = new Job();

  constructor(
    public authService: AuthService,
    private postcodeService: PostcodeService,
    public fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
    if(this.authService.user$){
      this.userSub = this.authService.user$.subscribe((user) => {
        this.user = user;
        this.newJob.issueUid = user.uid;
      });
    }
  }

  submit() {
    this.postcodeService.convertPostcodeToLatLong(this.postcodeValue).subscribe(
      (data) => {
      this.newJob.lngLat = new google.maps.LatLng( (data as any).result.latitude, (data as any).result.longitude)
      },
      (error) => this.errorHandler
    );
    this.uploadImage();
  }

  uploadImage() {
    var self = this;
    if (this.file) {
      this.fileUploadService.uploadFile(this.file, BlobLocations.jobPostingImages, function (result) {
        if(result === 'error')
          console.log('there was an error with the upload');
        else {
          self.newJob.picture = result;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  errorHandler(error){
    console.log(error)
  }

  dismissComponent() {
    this.dismiss.emit(true);
  }

  onClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      this.file = fileUpload.files;
    };
    fileUpload.click();
  }
}

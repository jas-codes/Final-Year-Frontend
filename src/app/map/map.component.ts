import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IUser } from '../services/user.model';
import { Subscription } from 'rxjs';
import { JobsService } from '../services/jobs.service';
import { MapService } from './map-services/map.service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Job } from '../models/job';
import { UserTypes } from '../enums/user-types';
import { CompaniesService } from '../services/companies.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { CompletionState } from '../enums/completionState';
import { Quote } from '../models/quote';
import { Company } from '../models/company';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy  {
  //component Variables
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  selectedJob: Job;
  jobsList: Job[];
  jobCollection: AngularFirestoreCollection<Job>;
  postJob: boolean = false;
  abilityToPostJobs: boolean = false;
  provideQuote: boolean = false;
  acceptedJob: boolean = false;

  //user variables
  user: IUser;
  userSub: Subscription;
  company: Company;

  //google maps variables
  getLocationOptions = { enableHighAccuracy: true, maximumAge:Infinity, timeout: 5000};
  mapHeight:string = window.innerHeight + 'px';
  centre: google.maps.LatLngLiteral;
  markers: any[] = [];
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    styles: [{
      "featureType": "poi",
      "stylers": [{ 
        visibility: "off" 
      }]
    }, {
      "featureType": "transit.station.bus",
      "stylers": [{
        visibility: "off"
      }]
    }],
    disableDefaultUI: true
  };

  constructor(
    private authService: AuthService,
    private jobsService: JobsService,
    private companiesService: CompaniesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public mapService: MapService
  ) { }

  ngOnInit( ): void {
    var self = this;

    if (this.authService.user$) { //get the user
      this.userSub = this.authService.user$.subscribe((user) => {
        this.user = user;
        if(user.accountType == UserTypes.user) { //what type of user
          this.drawCompanyMarkers();
          this.abilityToPostJobs = true;
        }
        else {
          this.drawJobMarkers();
          this.companiesService.getCompanyByUid(user.uid).subscribe((doc) => {
            doc.valueChanges().subscribe(company => {console.log(company);this.company = company});
          })
        }
      });
    }

    navigator.geolocation.getCurrentPosition( function(position) {
      self.centre = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    }, 
      this.errorCallbackAccuracy,
      this.getLocationOptions
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  //draw the available job markers on map
  private drawJobMarkers() {
    this.jobCollection = this.jobsService.getMapJobs()
    this.jobCollection.valueChanges().subscribe((jobs) => {
      this.jobsList = jobs;
      this.markers = []; //reset markers

      jobs.forEach((job) => {
        this.markers.push(this.mapService.addMarker(job));
      });
    });
  }

  //draw the company job markers on map
  private drawCompanyMarkers() {

  }

  //geolocation error callback
  errorCallbackAccuracy(err) {
    console.log('you have committed an oopsie');
    console.error(err)
  }

  //toggle new-job component
  showPostJob() {
    this.postJob = !this.postJob;
  }

  //open marker content when clicked
  openInfo(marker: MapMarker, index) {
    this.selectedJob = this.jobsList[index];
    this.infoWindow.open(marker);
  }

  showProvideQuote() {
    this.provideQuote = !this.provideQuote;
  }

  setQuote(event: number) {
    var quote = new Quote();
    quote.quote = event;
    quote.uid = this.user.uid;
    quote.companyName = this.company.companyName
    this.jobsService.setQuote(this.selectedJob, quote);
  }

  setAccepted(){
    this.selectedJob.completionState = CompletionState.traderAccepted;
    this.jobsService.setAcceptedJob(this.selectedJob, this.company.uid);
    this.infoWindow.close()
  }

  navigationLinks(url) {
    this.router.navigate([
      {
        outlets: {
          navLinks: [url]
        }
      }
    ],
      {
        relativeTo: this.activatedRoute.parent
      }
    );
  }

}

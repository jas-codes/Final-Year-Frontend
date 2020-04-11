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
  selected: any;
  jobsList: Job[];
  jobCollection: AngularFirestoreCollection<Job>;
  companyList: Company[];
  companycollection: AngularFirestoreCollection<Company>;
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
        if(user != null){
          this.user = user;
          if(user.accountType == UserTypes.user) { //what type of user
            this.drawCompanyMarkers();
            this.abilityToPostJobs = true;
          }
          else {
            this.drawJobMarkers(); //draw job markers and get company of user
            this.companiesService.getCompanyByUid(user.uid).valueChanges()
              .subscribe((company) => this.company = company)
          }
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
        this.markers.push(this.mapService.addMarker(job.lngLat, job.title, job.trade));
      });
    });
  }

  //draw the company job markers on map
  private drawCompanyMarkers() {
    this.companycollection = this.companiesService.getCompanies()
    this.companycollection.valueChanges().subscribe((companies) => {
      this.companyList = companies;
      this.markers = []

      companies.forEach((company) => {
        this.markers.push(this.mapService.addMarker(company.latlng, company.companyName, company.tradeType))
      });
    });
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
    if(this.user.accountType == UserTypes.trader)
      this.selected = this.jobsList[index];
    else 
      this.selected = this.companyList[index];
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
    this.jobsService.setQuote(this.selected, quote);
  }

  setAccepted(){
    this.selected.completionState = CompletionState.traderAccepted;
    this.jobsService.setAcceptedJob(this.selected, this.company.uid);
    this.infoWindow.close()
  }

  navigationLinks(url) {
    this.router.navigate([
      { outlets: { navLinks: [url] }}
    ],
    { relativeTo: this.activatedRoute.parent });
  }
}

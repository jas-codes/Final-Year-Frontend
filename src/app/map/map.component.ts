import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IUser } from '../services/user.model';
import { Subscription } from 'rxjs';
import { JobsService } from '../services/jobs.service';
import { MapService } from './map-services/map.service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Job } from '../models/job';
import { UserTypes } from '../enums/user-types';

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
  postJob: boolean = false;
  abilityToPostJobs: boolean = false;

  //user variables
  user: IUser;
  userSub: Subscription;

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
  };

  constructor(
    private authService: AuthService,
    private jobsService: JobsService,
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
        else
          this.drawJobMarkers();
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
    this.jobsService.getMapJobs().valueChanges().subscribe((jobs) => {
      this.jobsList = jobs;
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
  openInfo(marker: MapMarker, content) {
    this.selectedJob = this.jobsList[content];
    this.infoWindow.open(marker);
  }

}

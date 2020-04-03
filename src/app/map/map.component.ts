/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit  {
  mapHeight = window.innerHeight;
  centre: google.maps.LatLngLiteral;
  postJob: boolean = false;
  options = { enableHighAccuracy: true, maximumAge:Infinity, timeout: 5000};

  constructor() { }

  ngOnInit(): void {
    var self = this;
    navigator.geolocation.getCurrentPosition( function(position) {
      self.centre = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    }, 
    this.errorCallbackAccuracy,
    this.options
    );
  }

  ngAfterViewInit(): void {
  
  }

  errorCallbackAccuracy(err) {
    console.log('you have committed an oopsie');
    console.error(err)
  }

  showPostJob() {
    this.postJob = !this.postJob;
  }

}

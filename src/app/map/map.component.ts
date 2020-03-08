/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit  {
  screenAdjust = 40;
  mapHeight = screen.height;
  centre: google.maps.LatLngLiteral;

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
      { enableHighAccuracy: true, maximumAge:Infinity, timeout: 0}
    );
  }

  ngAfterViewInit(): void {
  
  }

  errorCallbackAccuracy() {
    console.log('you have committed an oopsie');
  }

}

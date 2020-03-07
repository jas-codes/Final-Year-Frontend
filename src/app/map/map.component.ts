/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit  {
  @ViewChild('gmap', {static: false}) gmapElement: any;
  map: google.maps.Map;
  mapHeight = screen.height;

  constructor() { }

  ngOnInit(): void {
    console.log(this.mapHeight);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    var uluru = {lat: -25.344, lng: 131.036};
    var mapProp = {
      center: uluru,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    console.log(this.map)
  }

}

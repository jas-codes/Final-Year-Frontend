import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  title = 'Final-Year-Frontend';
  showmaps: boolean = false;

  setAllComponents(){
    this.showmaps = false;
  }

  mapSelected() {
    this.setAllComponents();
    this.showmaps != this.showmaps;
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

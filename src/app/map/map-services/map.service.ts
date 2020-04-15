import { Injectable } from '@angular/core';
import { Job } from 'src/app/models/job';
import { TradeType } from 'src/app/enums/trade-types';
import { Icons } from 'src/app/enums/icons';
import { UserTypes } from 'src/app/enums/user-types';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  //instantiates an object marker
  addMarker(lngLat, title, trade) {
    var marker = { //not using default type google.maps.marker due to bespoke implementation
      position: {
        lat: lngLat.lat,
        lng: lngLat.lng
      },
      title: 'Title: ' + title,
      options: {
        icon: this.iconSelection(trade), 
      }
    }
    return marker
  };

  addPersonalMarker(lngLat) {
    var marker = {
      position: {
        lat: lngLat.lat,
        lng: lngLat.lng
      },
      options: {
        icon: Icons.userHere
      }
    }
    return marker;
  }

  CompareLngLatPoints(a, b) {
    if(a.lng == b.lng)
      if(a.lat == b.lat)
        return true
    return false;
  }

  //Determines which icon to provide to marker
  iconSelection(trade: TradeType){
    switch (trade) {
      case TradeType.carpentry:
        return Icons.carpentry;
      case TradeType.painter:
        return Icons.painter;
      case TradeType.plaster:
        return Icons.plaster;
      case TradeType.builder:
        return Icons.builder;
      case TradeType.cleaner:
        return Icons.cleaner;
      case TradeType.plumber:
        return Icons.plumber;
      case TradeType.landscaper:
        return Icons.landscaper;
      case TradeType.locksmith:
        return Icons.locksmith;
      case TradeType.electrician:
        return Icons.electrician;
      default:
        return Icons.other;
    }
  }
}

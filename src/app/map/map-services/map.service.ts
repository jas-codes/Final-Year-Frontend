import { Injectable } from '@angular/core';
import { Job } from 'src/app/models/job';
import { TradeType } from 'src/app/enums/trade-types';
import { Icons } from 'src/app/enums/icons';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  //instantiates an object marker
  addMarker(job: Job) {
    var marker = { //not using default type google.maps.marker due to bespoke implementation
      position: {
        lat: job.lngLat.lat,
        lng: job.lngLat.lng
      },
      title: 'Title: ' + job.title,
      options: {
        icon: this.iconSelection(job.trade), 
      }
    }
    return marker
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

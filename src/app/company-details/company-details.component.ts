import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Company } from '../models/company';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  //Component input output
  @Input() company: Company = new Company();
  @Input() showDetails: boolean = false;
  @Output() dismiss = new EventEmitter<boolean>();

  //image selection increments
  positiveIncrement = 1;
  negativeIncrement = -1;
  imageArrayIndex: number = 0;
  currentImage: string = '';

  constructor() { }

  ngOnInit(): void {
    //don't show if no images
    if(this.company.photos[0])
      this.currentImage = this.company.photos[0];
  }

  moveImageIndex(direction: number) {
    let newIndex = this.imageArrayIndex + direction;//increment index
    if(this.company.photos.length > newIndex && newIndex >= 0) //if new index is out of bounds don't allow
      this.imageArrayIndex = newIndex
    
    this.currentImage = this.company.photos[this.imageArrayIndex];
  }

  dismissComponent() {
    this.dismiss.emit(true);
  }  

}

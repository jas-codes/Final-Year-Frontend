import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Company } from '../models/company';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  @Input() company: Company = new Company();
  @Input() showDetails: boolean = false;
  @Output() dismiss = new EventEmitter<boolean>();

  positiveIncrement = 1;
  negativeIncrement = -1;

  currentImage: string = '';
  imageArrayIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
    if(this.company.photos[0])
      this.currentImage = this.company.photos[0];
  }

  moveImageIndex(direction: number) {
    let newIndex = this.imageArrayIndex + direction;
    if(this.company.photos.length > newIndex && newIndex >= 0)
      this.imageArrayIndex = newIndex
    
    this.currentImage = this.company.photos[this.imageArrayIndex];
  }

  dismissComponent() {
    this.dismiss.emit(true);
  }  

}

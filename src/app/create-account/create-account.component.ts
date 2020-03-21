import { Component, OnInit } from '@angular/core';
import { TradeType } from '../enums/trade-types';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  trades = Object.values(TradeType);
  maxDate = new Date();

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    nickname: new FormControl('', Validators.required),
    postcode: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    companyName: new FormControl('', Validators.required),
    tradeType: new FormControl('', Validators.required),
    accountType: new FormControl('', Validators.required),
    dob: new FormControl('', Validators.required),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
  })




  constructor() { }

  ngOnInit(): void {
    this.maxDate.setDate(this.calcMaxDate());
  }

  calcMaxDate(): number {
    return (this.maxDate.getDate() - (365*18))
  }

  addPicture() {

  }

  onSubmit(){
    console.log(this.form.value)
  }

}

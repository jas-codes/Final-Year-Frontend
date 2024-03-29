import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostcodeService {

  constructor(
    private http: HttpClient
  ) { }

  convertPostcodeToLatLong(postcode) { //send to api to get result
    return this.http.get(`https://api.postcodes.io/postcodes/${postcode}`);
  }
}

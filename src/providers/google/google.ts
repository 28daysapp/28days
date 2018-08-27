import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable()
export class GoogleProvider {

  data

  constructor(public http: HttpClient) {
    console.log('Hello GoogleProvider Provider');
  }

  // Received data is the Google Place photo image reference
  getPlacePhoto(data) {

    this.data = data;
    console.log("Google photo reference: " + this.data);

    const reference = this.data;
    const apiKey = 'AIzaSyDrABdIKzwnM37L1q1R_0qCMwsLhSiMjWk';
    const url = 'https://maps.googleapis.com/maps/api/place/photo?'
    

    this.http.get(url + `maxwidth=400&photoreference=${reference}&key=${apiKey}`)
      .subscribe(data => {
        this.data = data;
        return this.data
      });
    }
}

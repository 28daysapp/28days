import { HttpClient, HttpHeaders } from '@angular/common/http';
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


    var headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*')



    this.http.get(url + `maxwidth=400&photoreference=${reference}&key=${apiKey}`, { headers })
      .subscribe(data => {
        this.data = data;
        console.log(this.http.options)
        return this.data
      });
  }

  getGooglePhoto() {
    this.http.get('https://us-central1-days-fd14f.cloudfunctions.net/getGooglePhotos')
    .subscribe(data => {
      return data
    });
  }


}

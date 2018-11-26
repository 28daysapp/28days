import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, ElementRef } from '@angular/core';

declare let google;

@Injectable()
export class GoogleProvider {

  constructor(public http: HttpClient) {
    console.log('Hello GoogleProvider Provider');
  }

  // Received data is the Google Place photo image reference
  getPlacePhoto(reference) {

    const apiKey = 'AIzaSyDrABdIKzwnM37L1q1R_0qCMwsLhSiMjWk';
    const url = 'https://maps.googleapis.com/maps/api/place/photo?'

    const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*')

    this.http.get(url + `maxwidth=400&photoreference=${reference}&key=${apiKey}`, { headers })
      .subscribe(photos => {
        return photos
      }, (error) => {
        console.log(error);
      });
  }

  // userInput = 사용자 입력 (지역 이름, 구체적인 병원/센터 이름) , placeType = hospital or counseling center
  searchByText(map : ElementRef, userInput: String, placeType: String) {

    //한국어로 서치바에 입력될 값
    let query: String;
    let places;

    if (placeType === "psychiatric" ? query = "정신과" : query = "심리상담센터") {

      const latLng = new google.maps.LatLng(37.532600, 127.024612)

      let request = {
        location: latLng,
        radius: '500',
        query: userInput + " " + query,
        language: 'ko',
        type: ["hospital", "health", "doctor"]
      };

      let service = new google.maps.places.PlacesService(map);
      service.textSearch(request, (results, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) { 

            const randomNumber = Math.floor(Math.random() * 4) + 1;
            places = results;
            places[i].reviewCount = 0;
            places[i].ratings = 0;
            places[i].image = "assets/imgs/hospital-default" + randomNumber + ".svg";
            places[i].photo = this.getPlacePhoto(results[i].reference)
          }
        } else {
          console.log("Status error: " + status);
        }
      }, (error) => {
        console.log("Error: " + error);
      });


    }
  }


}

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import firebase from "firebase";

declare let google;

@Injectable()
export class GoogleProvider {
  places: any;

  constructor(public http: HttpClient) {
    console.log("Hello GoogleProvider Provider");
  }

  loadMap(map, mapElement) {
    return new Promise(resolve => {
      // this.geolocation.getCurrentPosition().then((position) => {
      //   this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //   // If Google Api current location is disabled, default location is Seoul City Hall
      //   if (!position) {
      //     this.latLng = new google.maps.LatLng(37.532600, 127.024612)
      //   }

      //   this.mapOptions = {
      //     center: this.latLng,
      //     zoom: 14,
      //     mapTypeId: google.maps.MapTypeId.ROADMAP,
      //     streetViewControl: false
      //   }
      //   this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
      // }, (error) => {
      //   console.log('Could not load the map: ' + error);
      // });

      // If Google Api current location is disabled, default location is Seoul City Hall
      const latLng = new google.maps.LatLng(37.5326, 127.024612);

      const mapOptions = {
        center: latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false
      };
      map = new google.maps.Map(mapElement.nativeElement, mapOptions);

      resolve(map);
    });
  }

  getPlacePhoto(reference) {
    const apiKey = "AIzaSyAUmoDlosjlNS8kaaw6zwH5yC5FAlKP7Yg";
    const url = "https://maps.googleapis.com/maps/api/place/photo?";

    const headers = new HttpHeaders().set("Access-Control-Allow-Origin", "*");

    this.http
      .get(url + `key=${apiKey}&photoreference=${reference}&maxwidth=400`, {
        headers
      })
      .subscribe(
        photos => {
          console.log("Place photo result: ", JSON.stringify(photos));
          return photos;
        },
        error => {
          console.log(error);
        }
      );
  }

  searchByText(userInput: String, placeType: String, latLng, map) {
    return new Promise((resolve, reject) => {
      if (!userInput) {
        userInput = "서울";
      }

      let searchQuery = "";
      if (
        placeType === "hospital"
          ? (searchQuery = "정신과")
          : (searchQuery = "심리상담센터")
      ) {
        latLng = new google.maps.LatLng(37.5663, 126.9779);

        let request = {
          location: latLng,
          radius: "500",
          query: userInput + " " + searchQuery,
          language: "ko",
          type: ["hospital", "health", "doctor"]
        };

        let service = new google.maps.places.PlacesService(map);
        service.textSearch(request, (results, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
              this.places = results;
              this.places[i].reviewCount = 0;
              this.places[i].ratings = 0;

              try {
                this.places[i].image = results[i].photos[0].getUrl();
              } catch (error) {
                this.places[i].image = "/assets/imgs/psych1.png";

                console.log(error);
              }
              this.countReviews(this.places[i].place_id, i);
            }
          } else {
            console.log("Status error: " + status);
          }

          resolve(this.places);
        });
      }
    });
  }

  countReviews(placeId, i) {
    firebase
      .database()
      .ref("/placeInfo/" + placeId)
      .once("value")
      .then(snapshot => {
        if (snapshot.val() === null) {
          return;
        } else {
          this.places[i].reviewCount = snapshot.val().reviewCount;
          this.places[i].ratings = snapshot.val().ratings;
          return;
        }
      });
  }
}

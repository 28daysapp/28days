import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import firebase from 'firebase';

declare var google;

@IonicPage()
@Component({
  selector: 'page-place-detail',
  templateUrl: 'place-detail.html',
})
export class PlaceDetailPage {

  @ViewChild("map") mapElement: ElementRef;

  fireusers = firebase.database().ref('/users');
  firecommunity = firebase.database().ref('/community');
  user: any;
  map: any;
  place: any;
  address: string;
  name: string;
  phone: string;
  website: string;
  placeId: string;
  service: any;
  mapOptions: any;
  latLng

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.user = firebase.auth().currentUser;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaceDetailPage');
    this.getGoogleInfo();
  }

  getGoogleInfo() {
    this.place = this.navParams.get('place');
    this.name = this.place.name;
    this.address = this.place.formatted_address.substr(5); // Removes '대한민국' from the address
    this.placeId = this.place.place_id;
    this.getPlaceDetails();
  }

  getPlaceDetails() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);

    let request = {
      placeId: this.placeId,
      fields: ['formatted_phone_number', 'formatted_address', 'opening_hours', 'website', 'photo', 'price_level']
    }

    let service = new google.maps.places.PlacesService(this.map);
    service.getDetails(request, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        this.phone = results.formatted_phone_number;
        this.website = results.website;
      } else {
        console.log("Status error: " + status);
      }
    }, (error) => {
      console.log("Error: " + error);
    });
  }

  getReviews() {

  }

  reviewWrite() {
    console.log("placeId"+this.placeId);
    this.navCtrl.push('ReviewWritePage', {
      placeId: this.placeId
    });
  }

}

import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-place-detail',
  templateUrl: 'place-detail.html',
})
export class PlaceDetailPage {

  @ViewChild("map") mapElement: ElementRef;

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, public loadingCtrl: LoadingController) {
    
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
    
    console.log("나오나?1111111111111");
    let service = new google.maps.places.PlacesService(this.map);
    service.getDetails(request, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log("나오나?22222222222");
        console.log(results);
        this.phone = results.formatted_phone_number;
        this.website = results.website;

        console.log("por que no sale??? " + this.phone + " " + this.website);

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
    this.navCtrl.push('ReviewWritePage');
  }



  // presentLoading() {
  //   const loader = this.loadingCtrl.create({
  //     content: "리뷰를 가져오고 있어요!",
  //     duration: 2000
  //   });
  //   loader.present();
  // }

}

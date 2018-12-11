import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import firebase from 'firebase';

import { AuthProvider } from '../../providers/auth/auth';
import { ReviewProvider } from '../../providers/review/review';
import { UserProvider } from '../../providers/user/user';

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
  openingHours: any;
  photos: any;
  placeId: string;
  service: any;
  mapOptions: any;
  latLng: any;
  posts: any;
  showInfo: boolean = true;
  tab: String = 'info';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl: LoadingController, 
    public auth: AuthProvider, 
    public userProvider: UserProvider,
    public storage: Storage, 
    public alertCtrl: AlertController, 
    public reviewProvider: ReviewProvider
    ) {
    this.user = firebase.auth().currentUser;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaceDetailPage');
    this.changeTab();
  }

  ionViewWillEnter() {
    this.reviewProvider.readReviews(this.placeId).then((posts) => {
      this.posts = posts;
    });
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
      fields: ['formatted_phone_number', 'formatted_address', 'opening_hours', 'website', 'photos', 'price_level']
    }

    let service = new google.maps.places.PlacesService(this.map);
    service.getDetails(request, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        this.phone = results.formatted_phone_number;
        this.website = results.website;
        if (results.opening_hours) {
          this.openingHours = results.opening_hours.weekday_text
        }
        if (results.photos)
        this.photos = results.photos;
      } else {
        console.log("Status error: " + status);
      }
    }, (error) => {
      console.log("Error: " + error);
    });


  }


  changeTab() {
    if (this.tab === 'info') {
      this.showInfo = true;
      this.getGoogleInfo();
      return;
    } else {
      this.showInfo = false;
      return;
    }
  }

  reviewWrite() {
      this.navCtrl.push('ReviewWritePage', {
        place: this.place
      });
  }

}

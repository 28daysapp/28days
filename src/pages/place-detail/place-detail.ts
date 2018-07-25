import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Content } from 'ionic-angular';
import { ReviewProvider } from '../../providers/review/review';
import firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth/auth';

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
  latLng: any;
  posts: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public auth: AuthProvider, public userProvider: UserProvider,
    public storage: Storage, public alertCtrl: AlertController, public review: ReviewProvider) {
    this.user = firebase.auth().currentUser;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaceDetailPage');
    this.getGoogleInfo();
  }

  ionViewWillEnter() {
    this.review.getReviews(this.placeId).then((posts) => {
      this.posts = posts;
      console.log(this.posts)
      console.log(this.posts[0]);
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

  reviewWrite() {
    if (this.user) {
      this.navCtrl.push('ReviewWritePage', {
        placeId: this.placeId
      });
    } else {
      this.pleaselogin();
    }

  }

  pleaselogin() {
    let alert = this.alertCtrl.create({
      title: '로그인 후 사용하실 수 있습니다.',
      message: '28days에 로그인하시겠습니까?',
      buttons: [
        {
          text: '확인',
          handler: () => {
            this.navCtrl.push('LoginPage');
          }
        },
        {
          text: '취소',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

}
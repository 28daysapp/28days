import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController, AlertController, App, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { MenuController } from 'ionic-angular';
import { GoogleProvider } from '../../providers/google/google';
import firebase from 'firebase';

// import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-hospitalcenter',
  templateUrl: 'hospitalcenter.html',
})
export class HospitalcenterPage {

  @ViewChild("map") mapElement: ElementRef;

  map: any;
  service: any;
  latLng: any;
  mapOptions: any;
  marker: any;
  type: string = "center"
  query: string;
  places: any;

  details: any;
  url: string;
  area: string = "서울";
  user;

  rating;
  reviewCount;

  placePicture;

  matches;
  selected;
  loadingPlaces;
  apiProvider;
  loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private geolocation: Geolocation, public modalController: ModalController,
    public menu: MenuController, public appCrtl: App, public google: GoogleProvider, public loadingCtrl: LoadingController) {
    this.places = [];
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad HospitalcenterPage');

    this.user = firebase.auth().currentUser;
    if (this.user) {
      this.menu.enable(true, 'loggedInMenu');
      this.menu.enable(false, 'loggedOutMenu');
    }
    else {
      this.menu.enable(true, 'loggedOutMenu');
      this.menu.enable(false, 'loggedInMenu');
    }

    this.loadMap();

  }

  

  loadMap() {
    // this.geolocatio이 안돼서 임의로 기본 위치는 서울
    // this.geolocation.getCurrentPosition().then((position) => {
    //   console.log("여긴 못오고?");

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
    //   console.log("THIS MAP: " + this.map);
    // }, (error) => {
    //   console.log('Could not load the map: ' + error);
    // });
    // console.log("여기는???")

    // If Google Api current location is disabled, default location is Seoul City Hall

    this.latLng = new google.maps.LatLng(37.532600, 127.024612)

    this.mapOptions = {
      center: this.latLng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
    console.log("THIS MAP: " + this.map);

    console.log("this.area = " + this.area);

    this.searchByText(this.area);

    return;
  }

  searchByText(input) {
    this.presentLoading()

    let text = input

    if (!text) {
      this.area = "서울"
    } else if (text == "서울") {
      this.area = "서울";
    } else {
      this.area = text.srcElement.value;
    }

    if (this.type === "psychiatric" ? this.query = "정신과" : this.query = "심리상담센터") {

      this.latLng = new google.maps.LatLng(37.532600, 127.024612)
      if (!this.area) {
        this.area = "서울";
      }
      let request = {
        location: this.latLng,
        radius: '500',
        query: this.area + " " + this.query,
        language: 'ko',
        type: ["hospital", "health", "doctor"]
      };

      let service = new google.maps.places.PlacesService(this.map);
      service.textSearch(request, (results, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {

            const randomNumber = Math.floor(Math.random() * 4) + 1;
            this.places = results;
            this.places[i].reviewCount = 0;
            this.places[i].ratings = 0;
            this.places[i].image = "assets/imgs/hospital-default" + randomNumber + ".svg";
            this.places[i].photo = this.google.getPlacePhoto(results[i].reference)
            this.countReviews(results[i].place_id, i);
          }
        } else {
          console.log("Status error: " + status);
        }

      }, (error) => {
        console.log("Error: " + error);
      });


    }
  }

  countReviews(placeId, i) {
    firebase.database().ref('/placeInfo/' + placeId).once('value').then((snapshot) => {
      if (snapshot.val() === null) {
        return
      }
      this.places[i].reviewCount = snapshot.val().reviewCount;
      this.places[i].ratings = snapshot.val().ratings;
    })
  }


  placeDetail(place) {
    //this.appCrtl.getRootNavs()[0].push('PlaceDetailPage', { place: place });
    this.navCtrl.push('PlaceDetailPage', { place: place });
  }

  showExplanation() {
    let alert = this.alertCtrl.create({
      title: '정신병원과 상담센터?',
      message: `
      <p><strong>정신과</strong>: 약물 치료가 병행되고 심리상담/검사/치료 기록이 건강보험에 의해 남습니다.</p>

      <p><strong>상담센터</strong>: 약물 치료 없이 상담자와의 대화가 자기 통찰을 통해 건강한 심시을 회복할 수 있도록 돕습니다.</p>
      `,
      buttons: ['알겠어요!']
    });
    alert.present();
  }

  sort() {
    console.log("sort clicked")
    let alert = this.alertCtrl.create({
      title: '정렬 순서',
      buttons: [{ text: '후기 많은 순' }, { text: '별점 높은 순' }]
    });
    alert.present();
  }

  notReady() {
    let alert = this.alertCtrl.create({
      title: '알림',
      message: '아직 준비중인 서비스입니다.',
      buttons: [
        {
          text: '확인',
          role: 'cancel'
        },
      ]
    });
    alert.present();
  }

  presentLoading() {
    let loading = this.loadingCtrl.create();

    loading.present()

    setTimeout(()=> {
      loading.dismiss();
    }, 300)
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      //this.ionViewWillEnter();
      refresher.complete();
    }, 2000);
  }

}



import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';


declare let google;

@IonicPage()
@Component({
  selector: 'page-place-list',
  templateUrl: 'place-list.html',
})
export class PlaceListPage {

  @ViewChild("map") mapElement: ElementRef;

  map: any;
  service: any;
  latLng: any;
  mapOptions: any;
  marker: any;
  type: string = "center"
  query: string;
  places: any;

  adExists: boolean = false;

  details: any;
  url: string;
  user;

  rating;
  reviewCount;

  placePicture;

  matches;
  selected;
  loadingPlaces;
  apiProvider;
  loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
    public userProvider: UserProvider, public loadingCtrl: LoadingController) {
    this.places = [];
    this.user = this.userProvider.readCurrentUser();
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad PlaceListPage');

    this.loadMap();

  }

  loadMap() {
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
    this.latLng = new google.maps.LatLng(37.532600, 127.024612)

    this.mapOptions = {
      center: this.latLng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);

    this.searchByText("강남");

    return;
  }

  searchByText(userInput) {
    this.presentLoading()

    if (!userInput) {
      userInput = "강남"
    }
    if (this.type === "psychiatric" ? this.query = "정신과" : this.query = "심리상담센터") {

      this.latLng = new google.maps.LatLng(37.532600, 127.024612)

      let request = {
        location: this.latLng,
        radius: '500',
        query: userInput + " " + this.query,
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
            // this.places[i].photo = this.googleProvider.getPlacePhoto(results[i].reference)
            this.countReviews(this.places[i].place_id, i);

          }
        } else {
          console.log("Status error: " + status);
        }
      })


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
    this.navCtrl.push('PlaceDetailPage', { place: place });
  }

  showExplanation() {
    let alert = this.alertCtrl.create({
      title: '정신병원과 상담센터?',
      message: `
      <p><strong>정신과</strong>: 약물 치료가 병행될 수 있고 보험 처리가 되어서 상담센터보다 조금 더 저렴한 편이야.</p>

      <p><strong>상담센터</strong>: 상담자와의 대화를 통해 자신을 좀 더 깊게 이해하고 건강한 마음을 회복할 수 있도록 돕는 곳이야.</p>
      `,
      buttons: ['알겠어!']
    });
    alert.present();
  }

  sort() {
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

    setTimeout(() => {
      loading.dismiss();
    }, 300)
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}

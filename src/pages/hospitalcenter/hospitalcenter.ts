import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController } from 'ionic-angular';
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
  area: string;
  user;

  reviewCount;

  matches;
  selected;
  loadingPlaces;
  apiProvider;


  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, public modalController: ModalController, 
    public menu: MenuController, public google: GoogleProvider) {
    this.places = [];
  }

  ionViewDidLoad() {
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


    this.searchByText(this.area);

    return;
  }

  searchByText(input) {

    if(!input) {
      this.area = "서울";
    } else {
      this.area = input.srcElement.value;
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

            this.places = results;
            console.log("results: " + results[i]);
            // console.log("results: " + results[i].val());
            console.info(results)
            console.log("results[i].place_id: " + results[i].place_id);


            this.places[i].reviewCount = 0;

            firebase.database().ref('/placeInfo/' + results[i].place_id).once('value', function (snap) {
              if(snap.val() === null) {
                // this.reviewCount = snap.val().reviewCount;
                // this.places[i].reviewCount = 0;
              } else {
                this.places[i].reviewCount = snap.val().reviewCount;
              }
        
            }).then(()=>{
              // if(!this.places[i].reviewCount) {
                // this.places[i].reviewCount = 0;
              // }
            })

            let imgReference = this.places[i].reference; 
            this.places[i].image = this.google.getPlacePhoto(imgReference);
            console.info("Places image: " + this.places[i].image);
          }

        } else {
          console.log("Status error: " + status);
        }

      }, (error) => {
        console.log("Error: " + error);
      });


    }
  }

  // countReviews(placeId, i) {

  //   firebase.database().ref('/placeInfo/' + placeId).once('value', function (snap) {
  //     console.log("88888888888888888888888888888888888888 placeId: " + placeId);
  //     if(snap.val() != null) {
  //       // this.reviewCount = snap.val().reviewCount;
  //       this.places[i].reviewCount = snap.val().reviewCount;
  //       console.log("eh review count 왜 안나옴: " + this.places[i].reviewCount);

  //     } else {
  //       this.places[i].reviewCount = 0;
  //       console.log("eh review count 왜 안나옴: " + this.places[i].reviewCount);

  //     }

  //   })

  // }

  placeDetail(place) {
    this.navCtrl.push('PlaceDetailPage', {
      place: place
    });
  }

  sort() {
    console.log("sort clicked")
    
  }

}



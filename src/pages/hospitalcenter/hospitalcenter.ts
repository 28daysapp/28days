import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { MenuController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, public modalController: ModalController, public menu: MenuController) {
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
    console.log("로드맵엔 들어오는데");

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


    this.searchByText();

    return;
  }

  searchByText() {
    console.log('여기는 나오냐?')
    if (this.type === "psychiatric" ? this.query = "정신과" : this.query = "심리상담센터") {
      console.log(this.query)
      console.log(this.area);
      this.latLng = new google.maps.LatLng(37.532600, 127.024612)
      console.log("latlng다 이놈아: " + this.latLng)
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

      // let service = new google.maps.places.PlacesService(this.map);
      // service.textSearch(request, (results, status) => {
      //   if (status == google.maps.places.PlacesServiceStatus.OK) {
      //     for (let i = 0; i < results.length; i++) {
      //       this.places = results;
      //       console.log(results);
      //     }
      //   } else {
      //     console.log("Status error: " + status);
      //   }

      // }, (error) => {
      //   console.log("Error: " + error);
      // });

    }
  }



  presentAreaModal() {
    // let areaModal = this.modalController.create('SearchAreaPage', {
    //   type: this.type
    // });
    // areaModal.onDidDismiss(data => {
    //   this.area = data.area;
    //   this.type = data.type;
    //   this.navCtrl.push('SearchPage', {
    //     area: this.area,
    //     type: this.type
    //   });
    // })
    // areaModal.present();
  }

  placeDetail(place) {
    // this.navCtrl.push('PlaceDetailPage', {
    //   place: place
    // });
  }

  sort() {
    console.log("sort clicked")
    
  }


}



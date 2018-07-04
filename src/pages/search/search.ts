import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, IonicPage, AlertController } from 'ionic-angular';

import { Geolocation} from "@ionic-native/geolocation";

declare var google;

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  @ViewChild("map") 
  mapElement : ElementRef;

  map : any;
  alertCtrl : AlertController;
  latLng: any;
  mapOptions: any;
  markers: any;
  isKM: any = 500;
  isType: any = "";
  places: Array<any>;

  constructor(public navCtrl: NavController, private ngZone: NgZone, private geolocation : Geolocation) {
    this.generatePlaces();
  }

  generatePlaces() {
    // this.places2 = [
    //   "정신과1",
    //   "상담센터1",
    //   "청소년상담센터"
    // ];
  }

  getPlaces(event: any) {
    this.generatePlaces();
    let searchVal = event.target.value;
    if(searchVal && searchVal.trim() != '') {
      this.places = this.places.filter((topic) => {
        return (topic.toLowerCase().indexOf(searchVal.toLowerCase()) > -1);
      })
    }
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
     
      this.mapOptions = {
        center: this.latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }   

      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);

    }, (err) => {
      alert('err '+err);
    });
  }

 /*-----------------Find Nearby Place------------------------*/ 

  nearbyPlace(){
    this.loadMap();
    this.markers = [];
    let service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
        location: this.latLng,
        radius: this.isKM,
        types: [this.isType]
    }, (results, status) => {
        this.callback(results, status);
    });
  }

  callback(results, status) {
    console.log("status: " + status);
    console.log("google maps places: " + google.maps.places);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        this.createMarker(results[i]);

      }
    }
  }

  createMarker(place){
    var placeLoc = place;
    console.log('placeLoc',placeLoc)
    this.markers = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location
    });

    let infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(this.markers, 'click', () => {
      this.ngZone.run(() => {
        infowindow.setContent(place.name);
        infowindow.open(this.map, this.markers);
      });
    });
  }

  addMarker() {
    var userMarker = "assets/imgs/custom_icon.png";
    var marker = new google.maps.Marker({
      map : this.map,
      animation : google.maps.Animation.DROP,
      postiion : this.map.getCenter(),
      icon : userMarker
  });

  // google.maps.event.addListener(marker, "click", () => {
  //     const messages = "Latitude : " + this.userLat + "<br>Longitude : " + this.userLong;
  //     const alert = this.alertCtrl.create({
  //       title: '현재 위치',
  //       message : messages,
  //       buttons: ['확인']
  //     });
  //     alert.present();
  //   });
  // }

  // listPlaces() {
  //   this.navCtrl.push('PlacesPage');
  // }
  }
}

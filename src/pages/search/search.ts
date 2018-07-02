import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, IonicPage, AlertController } from 'ionic-angular';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from "@ionic-native/geolocation";

declare var google;

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  @ViewChild("map") mapElement : ElementRef;
  private options : GeolocationOptions;
  private currentPos : Geoposition;
  private userLat : any; //User's latitude 
  private userLong : any; // User's longitude
  private map : any;
  private alertCtrl : AlertController;


  constructor(public navCtrl: NavController, private geolocation : Geolocation) {
    this.generateTopics();
  }

  topics: string[];

  generateTopics() {
    this.topics = [
      "Topic 1",
      "Topic 2",
      "Topic 3",
      "Map1",
      "Hospital",
      "Doctor"
    ];
  }

  ionViewDidEnter() {
    this.getUserPosition();
  }

  getUserPosition() {
    this.options = {
      enableHighAccuracy : false
    };

    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
      this.currentPos = pos;
      console.log(pos);

      this.userLat = pos.coords.latitude;
      this.userLong = pos.coords.longitude;

      this.addMap(pos.coords.latitude, pos.coords.longitude);

    }, (err : PositionError) => {
      console.log("Error : " + err.message);
    });
  }

  addMap(lat, long) {
    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
      center : latLng,
      zoom : 15,
      mapTypeId : google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.addMarker();
  }

  addMarker() {
    var userMarker = "assets/imgs/custom_icon.png";
    var marker = new google.maps.Marker({
      map : this.map,
      animation : google.maps.Animation.DROP,
      postiion : this.map.getCenter(),
      icon : userMarker
    });


    console.log(marker.position);
    console.log(this.userLat);
    console.log(this.userLong);

    google.maps.event.addListener(marker, "click", () => {
      const messages = "Latitude : " + this.userLat + "<br>Longitude : " + this.userLong;
      const alert = this.alertCtrl.create({
        title: '현재 위치',
        message : messages,
        buttons: ['확인']
      });
      alert.present();
    });
  }

  getTopics(ev: any) {
    this.generateTopics();
    let serVal = ev.target.value;
    if(serVal && serVal.trim() != '') {
      this.topics = this.topics.filter((topic) => {
        return (topic.toLowerCase().indexOf(serVal.toLowerCase()) > -1);
      })
    }
  }

}

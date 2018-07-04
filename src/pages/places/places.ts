import { Component, NgZone, ElementRef, ViewChild } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';


declare var google;

@IonicPage()
@Component({
  selector: 'page-places',
  templateUrl: 'places.html'
})


export class PlacesPage {

  @ViewChild('map')
  mapElement: ElementRef;

  map:any;
  latLng:any;
  markers:any;
  mapOptions:any;
  
  isKM:any=500;
  isType:any="";
 
  list: any;

  options: GeolocationOptions;
  currentPos: Geoposition;
  places: Array<any>;

  constructor(public navCtrl: NavController, private ngZone: NgZone, private geolocation : Geolocation) { 
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
        this.generateTopics(results, status);
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



  generateTopics(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          this.getTopics(results[i]);
  
        }
      }
  }

  getTopics(place) {
    var list = place
    console.log("Name : " + list.name);
    return list.name;
  }

}
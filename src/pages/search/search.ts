import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import { Geolocation} from "@ionic-native/geolocation";

declare var google;

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})

export class SearchPage {

  @ViewChild("map") mapElement : ElementRef;

  map : any;
  latLng: any;
  mapOptions: any;
  markers: any;
  text: string;
  query: string;
  places: Array<any>;
  placeid: string;
  url: string;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, private ngZone: NgZone,  public http: Http, private geolocation : Geolocation) {
    this.text = this.navParams.get('location');
  }

  ionViewDidLoad() {
    this.loadMap();
    this.places = [];
  }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
     
      this.mapOptions = {
        center: this.latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false
      }   

      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);

      this.searchByText(this.latLng);

    }, (err) => {
      alert('Error: ' + err);
    });
  }

 /*-----------------Search Place by Text------------------------*/   
  searchByText(location) {
    let service = new google.maps.places.PlacesService(this.map);
    if(this.text === "c" ? this.query = "상담센터" : this.query = "정신과")
    service.textSearch({
      location: location,
      query: this.query,
      radius: 100,
      language: "ko"
    }, (results, status) => {
      this.callback(results, status);
    });
  }

  callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
        this.placeDetails(results[i]);
      }
    }
  }

  // generatePlaces() {
  //   this.places = [];
  // }


  createMarker(place){
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

  placeDetails(place) {

    this.placeid = place.place_id;
    console.log("Place id: " + this.placeid);

    var xhr = new XMLHttpRequest();
    console.log("What's this: " + xhr.open('GET', 'https://maps.googleapis.com/maps/api/place/details/output?key=AIzaSyDq8tjTYhMTCmAeltpK7J8IaQ83ofsqFCU&placeid=' + this.placeid));

    this.url = "https://maps.googleapis.com/maps/api/place/details/output?key=AIzaSyDq8tjTYhMTCmAeltpK7J8IaQ83ofsqFCU&placeid=" + this.placeid;

    this.http.get(this.url).subscribe(data => {
        console.log("From the function: " + data);
    }, (err) => {
      console.log("Error: " + err);
    });

    this.places.push({
      name: place.name
    });
  }

}

import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})

export class SearchPage {

  @ViewChild("map") mapElement: ElementRef;

  map: any;
  service: any;
  infowindow: any;

  latLng: any;
  mapOptions: any;
  marker: any;
  text: string;
  query: string;
  places: any;
  placeId: string;
  url: string;
  area: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, public modalController: ModalController, ) {
    this.text = this.navParams.get('type');
    this.area = this.navParams.get('area');
    this.places = [];
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {
      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.mapOptions = {
        center: this.latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
      this.searchByText();
    }, (error) => {
      console.log('Could not load the map: ' + error);
    });
  }

  searchByText() {

    if (this.text === "c" ? this.query = "상담센터" : this.query = "정신과"){
      let request = {
        location: this.latLng,
        radius: '500',
        query: this.area + " " + this.query,
        language: 'ko'
      };

      let service = new google.maps.places.PlacesService(this.map);
      service.textSearch(request, (results, status) => {
        
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            this.places = results;
          }
        } else {
          console.log("Status error: " + status);
        }

      }, (error) => {
        console.log("Error: " + error);
      });
      console.log(this.places);
    }
  }



  presentAreaModal() {
    let areaModal = this.modalController.create('SearchAreaPage');
    areaModal.present();
  }


  // createMarker(places){
  //   this.marker = new google.maps.Marker({
  //     map: this.map,
  //     position: places.geometry.location
  //   });

  //   this.infowindow = new google.maps.InfoWindow();

  //   google.maps.event.addListener(this.marker, 'click', () => {
  //       this.infowindow.setContent(places.location, places.name);
  //       this.infowindow.open(this.map, this.marker);
  //   });
  // }

  // callback(results, status) {
  // if (status === google.maps.places.PlacesServiceStatus.OK) {
  //   for (var i = 0; i < results.length; i++) {
  //     this.createMarker(results[i]);
  //     this.placeDetails(results[i]);
  //   }
  // }
  // }

  // createMarker(place) {
  //   this.marker = new google.maps.Marker({
  //     map: this.map,
  //     position: place.geometry.location
  //   });

  //   let infowindow = new google.maps.InfoWindow();

  //   console.log("this marker: " + this.marker);
  //   google.maps.event.addListener(this.marker, 'click', () => {
  //     this.ngZone.run(() => {
  //       infowindow.setContent(place.name);
  //       infowindow.open(this.map, this.marker);
  //     });
  //   });
  // }



  /*-----------------Search place by Text------------------------*/
  // searchByText(place) {
  //   console.log("4: " + place);
  //   let service = new google.maps.places.PlacesService(this.map);

  //   let request = {
  //     location: place,
  //     radius: '500',
  //     query: '상담센터'
  //   };

  //   service.textSearch(request, (place, status) => {
  //     if (status == google.maps.places.PlacesServiceStatus.OK) {
  //       console.log("formatted address: " + place.formatted_address);
  //       console.log("geometry: " + place.geometry.location);
  //       console.log("name: " + place.name);
  //       console.log("place id: " + place.place_id);
  //       console.log("vicinity: " + place.vicinity);
  //       // createMarker(place);
  //     }
  //   }
  // }


  // if (this.text === "c" ? this.query = "상담센터" : this.query = "정신과")
  // console.log("6: 여기는??" + this.text);
  //   service.textSearch({
  //     place: place,
  //     query: this.query,
  //     radius: '100',
  //     language: 'ko'
  //   }, (results, status) => {
  //     this.callback(results, status);
  //   }, (error) => {
  //     console.log("Error: " + error);
  //   });




  // callback(place, status) {
  //   if (status == google.maps.places.PlacesServiceStatus.OK) {
  //     console.log("formatted address: " + place.formatted_address);
  //     console.log("geometry: " + place.geometry.location);
  //     console.log("name: " + place.name);
  //     console.log("place id: " + place.place_id);
  //     console.log("vicinity: " + place.vicinity);
  //     createMarker(place);
  //   }
  // }



  // generateplaces() {
  //   this.places = [];
  // }




  // placeDetails(place) {

  //   this.placeId = place.place_id;
  //   console.log("place id: " + this.placeId);

  //   var xhr = new XMLHttpRequest();
  //   console.log("What's this: " + xhr.open('GET', 'https://maps.googleapis.com/maps/api/place/details/output?key=AIzaSyDq8tjTYhMTCmAeltpK7J8IaQ83ofsqFCU&placeId=' + this.placeId));

  //   this.url = "https://maps.googleapis.com/maps/api/place/details/output?key=AIzaSyDq8tjTYhMTCmAeltpK7J8IaQ83ofsqFCU&placeId=" + this.placeId;

  //   this.http.get(this.url).subscribe(data => {
  //       console.log("From the function: " + data);
  //   }, (err) => {
  //     console.log("Error: " + err);
  //   });

  //   this.places.push({
  //     name: place.name
  //   });
  // }

}

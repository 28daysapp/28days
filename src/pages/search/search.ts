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
  latLng: any;
  mapOptions: any;
  marker: any;
  text: string;
  query: string;
  places: any;
  details: any;
  url: string;
  area: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, public modalController: ModalController) {
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

    if (this.text === "c" ? this.query = "상담센터" : this.query = "정신과") {
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

    }
  }



  presentAreaModal() {
    let areaModal = this.modalController.create('SearchAreaPage');
    areaModal.onDidDismiss(data => {
      this.area = data.area;
      this.navCtrl.push('SearchPage', {
        area: this.area
      });
    })
    areaModal.present();
  }

  placeDetail(place) {
    this.navCtrl.push('PlaceDetailPage', {
      place: place
    });
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { Geolocation } from '@ionic-native/geolocation';

// declare var google;

/**
 * Generated class for the HospitalcenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hospitalcenter',
  templateUrl: 'hospitalcenter.html',
})
export class HospitalcenterPage {

  tab1: string = "CenterPage";
  tab2: string = "HospitalPage";

  ionViewDidLoad() {
    console.log('ionViewDidLoad HospitalcenterPage');
  }

}

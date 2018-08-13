import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import firebase from 'firebase';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  user;
  constructor(public menu: MenuController){

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad HospitalcenterPage');
    this.user = firebase.auth().currentUser;
    if (this.user) {
      this.menu.enable(true, 'loggedInMenu');
      this.menu.enable(false, 'loggedOutMenu');
  }
  else{
    this.menu.enable(true, 'loggedOutMenu');
    this.menu.enable(false, 'loggedInMenu');
  }
}

}

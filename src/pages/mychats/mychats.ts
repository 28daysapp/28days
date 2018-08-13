import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import firebase from 'firebase';
/**
 * Generated class for the MychatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mychats',
  templateUrl: 'mychats.html',
})
export class MychatsPage {
  user;
  constructor(public menu: MenuController,public navCtrl: NavController, public navParams: NavParams, public appCtrl: App) {
  }

  requestchatpage() {
  	this.appCtrl.getRootNavs()[0].push('RequestchatPage');
  }

  requestedchatpage() {
  	this.appCtrl.getRootNavs()[0].push('RequestedchatPage');
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

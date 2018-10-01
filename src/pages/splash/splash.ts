import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad - SplashPage')

    const user = firebase.auth().currentUser;
    if (user) {
      this.navCtrl.setRoot('HomePage');
    } else {
      this.navCtrl.setRoot('TutorialPage');
    }
  }
}

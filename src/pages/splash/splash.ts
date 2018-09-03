import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SplashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
    setTimeout(() => {
    	this.storage.get('username').then((username) => {
        if (username) {
          this.navCtrl.push('TabsPage');
        } else {
          this.navCtrl.setRoot('IntroPage');
        }
      });
		}, 2000);
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';


/**
 * Generated class for the OnofflinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-onoffline',
  templateUrl: 'onoffline.html',
})
export class OnofflinePage {

  user;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public auth: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnofflinePage');

    // check if user already logged-in
    this.user = firebase.auth().currentUser;
  }

  onlineload() {
    if (this.user) {
      this.navCtrl.push('SupporterPopoverPage');
    } else {
      this.pleaselogin();
    }
  }

  pleaselogin() {
    let alert = this.alertCtrl.create({
      title: '로그인 후 사용하실 수 있습니다.',
      message: '28days에 로그인하시겠습니까?',
      buttons: [
        {
          text: '확인',
          handler: () => {
            this.navCtrl.push('LoginPage');
          }
        },
        {
          text: '취소',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

  // searchload() {
  //   this.navCtrl.push('SearchhelpPage');
  // }

}

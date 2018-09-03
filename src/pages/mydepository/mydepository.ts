import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the MydepositoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mydepository',
  templateUrl: 'mydepository.html',
})
export class MydepositoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
    let alert = this.alertCtrl.create({
      title: '알림',
      message: '아직 준비중인 서비스입니다.',
      buttons: [
        {
          text: '확인',
          handler: () =>{
            this.navCtrl.pop();
          }
        },
      ]
    });
    alert.present();
  }

}

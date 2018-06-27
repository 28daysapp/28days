import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { EmotionProvider } from '../../providers/emotion/emotion'

/**
 * Generated class for the EmotionbasketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-emotionbasket',
  templateUrl: 'emotionbasket.html',
})
export class EmotionbasketPage {
  one = 0;
  ten = 0;
  hundred = 0;
  thousand = 0;
  tenthousand = 0;
  loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public emotion: EmotionProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad - EmotionbasketPage');
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.emotion.getEmotion().then((res) => {
      console.log('EmotionbasketPage - ionViewDidLoad: length: ' + res);
      this.setlength(res);
      this.loading.dismiss();
    });
  }

  ionViewWillEnter() {
    console.log('emotionbasket - ionViewWillEnter');
    this.setlength(this.emotion.length);
  }

  alert() {
  	let alert = this.alertCtrl.create({
      title: '쓰레기통에 버린 건 잊어버려요~',
      message: '버려버린 감정쓰레기들을 다시 보는 건 내 감정에 도움이 되지 않을 거에요. 버린 감정쓰레기는 28DAYS가 모두 없애버릴게요!',
      buttons: [
        {
          text: '버리자!',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

  emotionthrow() {
  	this.navCtrl.push('EmotionthrowPage');
  }

  setlength(len) {
    // var length = len;
    var length = (len - len % 10) / 10;
    this.one = length % 10;
    this.ten = (length - length % 10) / 10 % 10;
    this.hundred = (length - length % 100) / 100 % 10;
    this.thousand = (length - length % 1000) / 1000 % 10;
    this.tenthousand = (length - length % 10000) / 10000 % 10;
  }

}

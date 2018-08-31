import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
// import { IamportService } from 'iamport-ionic-kcp';
import { Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  itemName;
  itemPrice;
  discountPrice;
  totalPrice;
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public alertCtrl: AlertController) {
    this.itemName = navParams.get("itemName");
    this.itemPrice = navParams.get("itemPrice");

    this.discountPrice = "0";
    //this.totalPrice = (parseInt(this.itemPrice.replace(/,/g, '')) - parseInt(this.discountPrice)).toLocaleString();
  }
  init() {
    if (typeof cordova !== 'undefined') {
      // Open the InAppBrowser Cordova plugin
      const browser = cordova.InAppBrowser.open('abc.com', '_blank', 'location=no,toolbar=no');
      // Add the event listener to the InAppBrowser instance
      browser.addEventListener('loadstop', (event) => {
        console.log("loadstop");
      });  
    // this.platform.ready().then(() => {
    //   let browser = cordova.InAppBrowser('https://ionic.io', '_system');
    //   browser.on("loadstop").subscribe(()=> console.log("loadstop"));
    // });
    }
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
  
  payment(event) {
    // const param = {
    //   pay_method : 'card',
    //   merchant_uid: 'merchant_' + new Date().getTime(),
    //   name: '주문명:결제테스트',
    //   amount: 1,
    //   buyer_email: 'hscho1226@gmail.com',
    //   buyer_name: '조현성',
    //   buyer_tel: '010-4005-6928',
    //   buyer_addr: '서울특별시 강남구 삼성동',
    //   buyer_postcode: '123-456'
    // };

    // this.iamport.payment("imp30525823", param)
    //   .then((response) => {
    //     if (response.isSuccess()) {
    //       //TODO: 결제성공 처리
    //       console.log("payment success");
    //     }
    //   })
    //   .catch((err) => {
    //     alert(err)
    //   });
    // }
  }

}

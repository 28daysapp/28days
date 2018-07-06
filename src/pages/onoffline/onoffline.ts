import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnofflinePage');
  }

  onlineload() {
    this.navCtrl.push('SupporterPopoverPage');
  }

  // searchload() {
  //   this.navCtrl.push('SearchPage');
  // }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SupporterPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-supporter-popover',
  templateUrl: 'supporter-popover.html',
})
export class SupporterPopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupporterPopoverPage');
  }

  supportertest() {
    this.navCtrl.push('SupporterPage');
  }

  counselortest() {
    this.navCtrl.push('CounselorPage');
  }

}

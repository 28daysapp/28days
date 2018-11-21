import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SelectImageModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-image-modal',
  templateUrl: 'select-image-modal.html',
})
export class SelectImageModalPage {

  images = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectImageModalPage');
    this.initializeImages();
  }

  initializeImages() {
    for (let i = 0; i < 14; i++) {
      this.images.push({reference: `../../assets/imgs/post${i + 1}.jpg`})
    }
  }

  clicked() {

  }

  dismiss() {
    this.viewController.dismiss();
  }

}

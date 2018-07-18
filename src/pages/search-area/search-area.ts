import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

/**
 * Generated class for the SearchAreaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-area',
  templateUrl: 'search-area.html',
})
export class SearchAreaPage {

  area: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalController: ModalController, public viewController: ViewController) {
  }

  dismiss() {
    let data = { area: this.area };
    this.viewController.dismiss(data);

  }

}

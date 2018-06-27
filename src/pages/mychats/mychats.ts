import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

/**
 * Generated class for the MychatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mychats',
  templateUrl: 'mychats.html',
})
export class MychatsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public appCtrl: App) {
  }

  requestchatpage() {
  	this.appCtrl.getRootNavs()[0].push('RequestchatPage');
  }

  requestedchatpage() {
  	this.appCtrl.getRootNavs()[0].push('RequestedchatPage');
  }

}

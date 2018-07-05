import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';


/**
 * Generated class for the CommunityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public community: CommunityProvider) {
  }

  depress() {
  	this.community.initializecom(0);
  	this.navCtrl.push('CommunitygroupPage');
  }

  anxiety() {
  	this.community.initializecom(1);
  	this.navCtrl.push('CommunitygroupPage');
  }

  schizo() {
  	this.community.initializecom(2);
  	this.navCtrl.push('CommunitygroupPage');
  }

  trauma() {
  	this.community.initializecom(3);
  	this.navCtrl.push('CommunitygroupPage');
  }

  school() {
  	this.community.initializecom(4);
  	this.navCtrl.push('CommunitygroupPage');
  }

  family() {
  	this.community.initializecom(5);
  	this.navCtrl.push('CommunitygroupPage');
  }

}

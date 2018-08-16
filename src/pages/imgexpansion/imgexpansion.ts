import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';

/**
 * Generated class for the ImgexpansionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-imgexpansion',
  templateUrl: 'imgexpansion.html',
})
export class ImgexpansionPage {

  post = this.community.post; // 현재 post
  constructor(public navCtrl: NavController, public navParams: NavParams, public community: CommunityProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImgexpansionPage');
  }

}

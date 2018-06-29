import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';

/**
 * Generated class for the CommunitydeletePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-communitydelete',
  templateUrl: 'communitydelete.html',
})
export class CommunitydeletePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public community: CommunityProvider) {
  }

  delete(){
   // this.community.communitydelete(this.community);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunitydeletePage');
  }
}

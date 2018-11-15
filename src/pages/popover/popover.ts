import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';

/**
 * Generated class for the PopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
  item;
  loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, public community: CommunityProvider, public loadingCtrl: LoadingController) {
  this.item = this.navParams.get('list');
  }

  communitydelete(item){

  }

  communityfix(){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

}

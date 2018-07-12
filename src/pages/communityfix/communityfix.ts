import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';

/**
 * Generated class for the CommunityfixPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-communityfix',
  templateUrl: 'communityfix.html',
})
export class CommunityfixPage {
	title;
	post = this.community.post;
	pick = false;
	text = '';
	posttitle = '';
	tag1 = '';
	tag2 = '';
	tag3 = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public community: CommunityProvider, public loadingCtrl: LoadingController) {
    this.title = this.community.title;
  }

	fix(text, posttitle, tag1, tag2, tag3) {
	  this.community.updatePost(text, posttitle, tag1, tag2, tag3).then(() => {
	  	this.navCtrl.pop();
	  });
	  let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    loading.present();
  }

}
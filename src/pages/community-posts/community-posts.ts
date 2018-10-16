import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-community-posts',
  templateUrl: 'community-posts.html',
})
export class CommunityPostsPage {

  community

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.community = this.navParams.get('community');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPostsPage');
    console.log("Community Posts community: " + JSON.stringify(this.community));
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';


@IonicPage()
@Component({
  selector: 'page-community-posts',
  templateUrl: 'community-posts.html',
})
export class CommunityPostsPage {

  communityInfo: any;
  posts: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public communityProvider: CommunityProvider) {
    this.communityInfo = this.navParams.get('communityInfo');
  }

  ionViewWillEnter() {
    this.getCommunityPosts(this.communityInfo.communityName);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPostsPage');
  }



  getCommunityPosts(communityName) {
    this.communityProvider.readCommunityPosts(communityName).then((posts)=> {
      this.posts = posts;
    });
  }

  toCommunityWrite(communityInfo) {
    this.navCtrl.push("CommunitywritePage", {
      communityInfo: communityInfo
    });
  }

}

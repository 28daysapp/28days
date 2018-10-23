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
    this.getCommunityPosts();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPostsPage');
    console.log("Community Posts community: " + JSON.stringify(this.communityInfo));
  }



  getCommunityPosts() {
    // this.communityProvider.readCommunityPosts().then((posts)=> {
    //   this.posts = posts;
    // });
  }

  addCommunityPost() {
    
  }

  toCommunityWrite() {
    this.navCtrl.push("CommunitywritePage");
  }

}

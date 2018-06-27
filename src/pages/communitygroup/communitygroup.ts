import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import { CommunitycommentProvider } from '../../providers/communitycomment/communitycomment';

/**
 * Generated class for the CommunitygroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-communitygroup',
  templateUrl: 'communitygroup.html',
})
export class CommunitygroupPage {
  @ViewChild('content') content: Content;
  title;
  posts;
  loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, public community: CommunityProvider,
    public loadingCtrl: LoadingController, public cocomment: CommunitycommentProvider) {
    this.title = this.community.title;
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.community.getallposts().then((posts) => {
      this.posts = posts;
      this.content.scrollToTop(0);
      this.loading.dismiss();
    });
  }

  comment(post) {
    this.cocomment.initializecomment(post);
  	this.navCtrl.push('CommunitycommentPage');
  }

  like(post) {
    if (post.likesrc == 'assets/like.png') {
      this.community.setLike(post).then(() => {
        post.likesrc = 'assets/like-full.png';
        post.like++;
      });
    } else {
      this.community.deleteLike(post).then(() => {
        post.likesrc = 'assets/like.png';
        post.like--;
      });
    }
  }

  communitywrite() {
  	this.navCtrl.push('CommunitywritePage');
  }

}

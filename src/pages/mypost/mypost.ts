/*
  2018.07.10 SUZY
*/
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content, ViewController } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import { CommunitycommentProvider } from '../../providers/communitycomment/communitycomment';
import { MyProvider } from '../../providers/my/my'
import firebase from 'firebase';

/**
 * Generated class for the MypostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mypost',
  templateUrl: 'mypost.html',
})
export class MypostPage {
  @ViewChild('content') content: Content;
  fireusers = firebase.database().ref('/users');
  firecommunity = firebase.database().ref('/community');
  title;
  posts;
  loading;
  popover;
  post;
  selectedData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private community: CommunityProvider,
    public loadingCtrl: LoadingController, public cocomment: CommunitycommentProvider,
    public viewCtrl: ViewController, public my: MyProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MypostPage');
  }

  ionViewWillEnter() {
    this.my.getallmypost().then((posts) => {
      this.posts = posts;
      this.content.scrollToTop(0);
    });
  }

  postdelete(post) {
    this.my.deletemypost(post);
    this.my.getallmypost().then((posts) => {
      this.posts = posts;
      this.content.scrollToTop(0);
    });
  }

  updatepost(post) {
    console.log(post);
    this.community.post = post;
    this.navCtrl.push('CommunityfixPage', {
      text: post.text,
    });
  }



}

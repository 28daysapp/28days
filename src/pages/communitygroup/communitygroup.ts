import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content, PopoverController, ViewController, AlertController  } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import { CommunitycommentProvider } from '../../providers/communitycomment/communitycomment';
import firebase from 'firebase';

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
  fireusers = firebase.database().ref('/users');
  firecommunity = firebase.database().ref('/community');
  title;
  posts;
  loading;
  popover;
  post;
  value;
  selectedData:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private community: CommunityProvider,
    public loadingCtrl: LoadingController, public cocomment: CommunitycommentProvider,
    public popoverCtrl: PopoverController, public viewCtrl: ViewController, public alertCtrl: AlertController
  ) {
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

  postdelete(post){
    this.community.postdelete(post);
       this.community.getallposts().then((posts) => {
      this.posts = posts;
      this.content.scrollToTop(0);
      this.loading.dismiss();
    });
  }

  updatepost(post){
    this.community.post = post;
    this.navCtrl.push('CommunityfixPage', {
     //text: post.text,
    });
  }

  usercorrect(post){
    var correct = false;
    if(firebase.auth().currentUser.uid == post.uid){
      correct = true;
    }
    return correct;
  }

  reportuser(post){
    var correct = true;
    if(firebase.auth().currentUser.uid == post.uid){
      correct = false;
    }
    return correct;
  }

  reportpost(post){
    if(post.value == false){
      let alert = this.alertCtrl.create({
        title: '',
        message: '이미 신고가 들어갔습니다.',
        buttons: [
          {
            text: '확인',
            role: 'cancel'
          }
        ]
      });
      alert.present();
      this.community.getallposts().then((posts) => {
        this.posts = posts;
        this.content.scrollToTop(0);
        this.loading.dismiss();
      });
    }
    else{
      this.community.reportpost(post);
      let alert = this.alertCtrl.create({
        title: '완료',
        message: '정상적으로 신고가 완료됐습니다.',
        buttons: [
          {
            text: '확인',
            role: 'cancel'
          }
        ]
      });
      alert.present();
      this.community.getallposts().then((posts) => {
        this.posts = posts;
        this.content.scrollToTop(0);
        this.loading.dismiss();
      });
    }
  }

  presentPopover(myEvnet){
    let popover = this.popoverCtrl.create(
       'PopoverPage'
    );
    popover.present({
      ev : myEvnet
    });
  }
}

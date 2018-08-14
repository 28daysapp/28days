import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content, PopoverController, ViewController, AlertController  } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import { CommunitycommentProvider } from '../../providers/communitycomment/communitycomment';
import firebase from 'firebase';

/**
 * Generated class for the SearchtagPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-searchtag',
  templateUrl: 'searchtag.html',
})
export class SearchtagPage {
  @ViewChild('content') content: Content;
  fireusers = firebase.database().ref('/users');
  firecommunity = firebase.database().ref('/community');
  title;
  posts;
  loading;
  popover;
  post;
  value;
  tag = this.community.tag;
  mosttag1;
  selectedData:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private community: CommunityProvider,
    public loadingCtrl: LoadingController, public cocomment: CommunitycommentProvider,
    public popoverCtrl: PopoverController, public viewCtrl: ViewController, public alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchtagPage');
  }

  ionViewWillEnter(){
    this.community.tagcount(this.tag).then((mosttag1) => {
      console.log(mosttag1);
      this.mosttag1 = mosttag1;
    });
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.community.searchtag(this.tag).then((posts) => {
      this.posts = posts;
      this.content.scrollToTop(0);
      this.loading.dismiss();
    });
    
    //this.community.getsearchposts(tag);
  }

  comment(post) {
    this.community.post = post;
    this.cocomment.initializecomment(post);
    this.navCtrl.push('CommunitycommentPage', {});
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
    let alert = this.alertCtrl.create({
      title: '경고',
      message: '정말 삭제하시겠습니까?',
      buttons: [
        {
          text: '예',
          handler: () =>{
            this.community.postdelete(post);
            this.community.searchtag(this.tag).then((posts) => {
              this.posts = posts;
              this.loading.dismiss();
            });
          }
        },
        {
          text: '아니요',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  updatepost(post){
    this.community.post = post;
    this.navCtrl.push('CommunityfixPage', {
     //text: post.text,
    });
  }

  urlcheck(post){
    var correct = false;
    if(post.urlcheck == true){
      correct = true;
    }
    return correct;
  }

  tagcheck(tag){
    var correct = false;
    if(tag != ''){
      correct = true;
    }
    return correct;
  }

  changeAnonymity(post){
    var correct = false;
    if(post.anonymity == true){
      correct = true;
    }
    else if(post.anonymity == false){
      correct = false;
    }
    return correct;
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

  doInfiniteSearch(tag) {
    this.community.tag = tag;
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.community.doInfiniteSearch(tag).then((posts) => {
      this.posts = posts;
      let d = this.content.getContentDimensions();
      this.content.scrollTo(0, d.scrollHeight - 20);
      this.loading.dismiss();
    });
  }
}

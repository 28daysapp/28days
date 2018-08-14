import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content, PopoverController, ViewController, AlertController  } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import { CommunitycommentProvider } from '../../providers/communitycomment/communitycomment';
import firebase from 'firebase';
import { MenuController } from 'ionic-angular';
/**
 * Generated class for the CommunitygroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {
  @ViewChild(Content) content: Content;
  fireusers = firebase.database().ref('/users');
  firecommunity = firebase.database().ref('/community');
  firereport = firebase.database().ref('/report');
  title;
  posts;
  loading;
  popover;
  post;
  value;
  flag;
  tag = '';
  tags;
  mosttag1;
  user;
  //anonymity = this.community.changeAnonymity;
  selectedData:any;
  constructor(public menu: MenuController, public navCtrl: NavController, public navParams: NavParams, private community: CommunityProvider,
    public loadingCtrl: LoadingController, public cocomment: CommunitycommentProvider,
    public popoverCtrl: PopoverController, public viewCtrl: ViewController, public alertCtrl: AlertController,
  ) {
    this.title = this.community.title;
  }

  ionViewDidLoad() {
  }

  
  ionViewWillEnter() {
    this.user = firebase.auth().currentUser;
    if (this.user) {
      this.menu.enable(true, 'loggedInMenu');
      this.menu.enable(false, 'loggedOutMenu');
  }
  else{
    this.menu.enable(true, 'loggedOutMenu');
    this.menu.enable(false, 'loggedInMenu');
  }
    this.community.mosttag().then((mosttag1) => {
      console.log(mosttag1);
      this.mosttag1 = mosttag1;
    });
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.community.getallposts().then((posts) => {
      this.posts = posts;
      this.content.scrollToTop(0);
      this.loading.dismiss();
    });
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

  /*
  postdelete(post){
    let alert = this.alertCtrl.create({
      title: '경고',
      message: '정말 삭제하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '확인',
          handler: () =>{
            this.community.postdelete(post);

          }
        }
      ]
    });
    alert.present();
  }

  updatepost(post){
    this.community.post = post;
    this.navCtrl.push('CommunityfixPage', {
      
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
    let alert = this.alertCtrl.create({
      title: '',
      message: '신고항목',
      buttons: [
        {
          text: '비방/욕설',
          handler: () => {
              this.community.reportpost(post);
              let alert = this.alertCtrl.create({
                title: '신고항목',
                message: '정상적으로 신고가 접수되었습니다',
                buttons: [
                  {
                    text: '확인',
                    role: 'cancel'
                  }
                ]
              })
              alert.present();
          }
        },
        {
          text: '게시글/댓글 도배',
          handler: () => {
              this.community.reportpost(post);
              let alert = this.alertCtrl.create({
                title: '신고항목',
                message: '정상적으로 신고가 접수되었습니다',
                buttons: [
                  {
                    text: '확인',
                    role: 'cancel'
                  }
                ]
              })
              alert.present();
          }
        },
        {
          text: '불법성 광고/홍보',
          handler: () => {
              this.community.reportpost(post);
              let alert = this.alertCtrl.create({
                title: '신고항목',
                message: '정상적으로 신고가 접수되었습니다',
                buttons: [
                  {
                    text: '확인',
                    role: 'cancel'
                  }
                ]
              })
              alert.present();
          }
        },
        {
          text: '개인정보/저작권 침해',
          handler: () => {
              this.community.reportpost(post);
              let alert = this.alertCtrl.create({
                title: '신고항목',
                message: '정상적으로 신고가 접수되었습니다',
                buttons: [
                  {
                    text: '확인',
                    role: 'cancel'
                  }
                ]
              })
              alert.present();
          }
        },
        {
          text: '기타',
          handler: () => {
              this.community.reportpost(post);
              let alert = this.alertCtrl.create({
                title: '신고항목',
                message: '정상적으로 신고가 접수되었습니다',
                buttons: [
                  {
                    text: '확인',
                    role: 'cancel'
                  }
                ]
              })
              alert.present();
          }
        },
        {
          text: '취소',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }
  */

  searchtag(tag){
    this.community.tag = tag;
    this.navCtrl.push("SearchtagPage", {tag: this.tag});
  }

  doInfinite() { // 다음 10개의 게시물 중 제일 위에 위치한 게시물의 스크롤에서부터 리스트 생성 
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.community.onInfiniteScroll().then((posts) => {
      this.posts = posts;
      let d = this.content.getContentDimensions();
      this.content.scrollTo(0, d.scrollHeight - 20);
      this.loading.dismiss();
    });
  }

}

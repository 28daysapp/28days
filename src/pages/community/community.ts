import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content, PopoverController, ViewController, AlertController, App } from 'ionic-angular';
import { CommunityProvider } from '../../providers/community/community';
import { CommunitycommentProvider } from '../../providers/communitycomment/communitycomment';
import firebase from 'firebase';
import { MenuController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {
  @ViewChild(Content) content: Content;
  
  communities: any;


  fireusers = firebase.database().ref('/users');
  firecommunity = firebase.database().ref('/community');
  firereport = firebase.database().ref('/report');
  posts;
  loading;
  popover;
  tag = '';
  mosttag1;
  mosttags;
  tagcntlimit = 0;
  user;
  value1 = true;
  value2 = false;
  //anonymity = this.community.changeAnonymity;
  selectedData: any;
  constructor(public menu: MenuController, public navCtrl: NavController, public navParams: NavParams, private community: CommunityProvider,
    public loadingCtrl: LoadingController, public cocomment: CommunitycommentProvider,
    public popoverCtrl: PopoverController, public viewCtrl: ViewController, public alertCtrl: AlertController, public appCtrl: App,
  ) {

  }

  ionViewDidLoad() {
  }


  ionViewWillEnter() {

    //--------------------------------------------------------------------------------
    this.getCommunityList() 
    //--------------------------------------------------------------------------------

    this.community.morepost = 0;
    this.tagcntlimit = 0;
    this.value1 = true;
    this.value2 = false;
    this.user = firebase.auth().currentUser;

    if (this.user) {
      this.menu.enable(true, 'loggedInMenu');
      this.menu.enable(false, 'loggedOutMenu');
    }
    else {
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
    });
    this.loading.dismiss();
  }

  //--------------------------------------------------------------------------------

  getCommunityList() {
    this.community.readCommunityList().then((communities) => {
      this.communities = communities;
      console.log("Community List: " + JSON.stringify(this.communities));
    })
  }

  toCommunityPosts(community) {
    this.navCtrl.push('CommunityPostsPage', {
      community: community
    });
  }

  addCommunity() {
    const communityName = "PTSD"
		const communityDescription = "이 그룹은 외상후 스트레스 장애 커뮤니티입니다. 같이 이겨내봐요."
    this.community.createCommunity(communityName, communityDescription);
  }



  //--------------------------------------------------------------------------------

  comment(post) { // 게시글의 제목을 누르면 게시글로 들어감 -- 추후 이름 수정 요망
    this.community.post = post;
    this.cocomment.initializecomment(post);
    //this.appCtrl.getRootNavs()[0].push('CommunitycommentPage', {});
    this.navCtrl.push('CommunitycommentPage');
  }

  like(post) { // 좋아요 내가 안해서 모름
    if (post.likesrc == 'assets/like.png') {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      this.community.setLike(post).then(() => {
        post.likesrc = 'assets/like-full.png';
        post.like++;
      });
      this.loading.dismiss();
    } else {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      this.community.deleteLike(post).then(() => {
        post.likesrc = 'assets/like.png';
        post.like--;
      });
      this.loading.dismiss();
    }
  }

  communitywrite() { // 글쓰기 버튼을 누르면 해당 페이지로 이동
    //this.appCtrl.getRootNavs()[0].push('CommunitywritePage', {});
    this.navCtrl.push('CommunitywritePage');
  }

  changeAnonymity(post) { // 익명 글쓰기를 체크했을 때 if 체크 안했을 시 else
    var correct = false;
    if (post.anonymity == true) {
      correct = true;
    }
    else if (post.anonymity == false) {
      correct = false;
    }
    return correct;
  }

  urlcheck(post) { // 게시글에 사진이 있을 시 true를 return함
    var correct = false;
    if (post.urlcheck == true) {
      correct = true;
    }
    return correct;
  }

  tagcheck(tag) { // 태그를 넣지 않은 게시글일 때 # 보이지 않게 하기위함
    var correct = false;
    if (tag != '') {
      correct = true;
    }
    return correct;
  }

  morepost() { // 더보기 버튼을 눌렀을 때 다음 게시물이 없을때 버튼을 안보이게 하기위함
    var correct = true;
    if (this.community.morepost % 10 != 0) {
      correct = false;
    }
    else if (this.community.morepost < 10) {
      correct = false;
    }
    return correct;
  }

  tagmore() {
    this.tagcntlimit++;
    this.community.tagmore().then((mosttag1) => {
      console.log(mosttag1);
      this.mosttag1 = mosttag1;
    });
  }

  tagless() {
    this.tagcntlimit--;
    this.community.mosttag().then((mosttag1) => {
      console.log(mosttag1);
      this.mosttag1 = mosttag1;
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.ionViewWillEnter();
      refresher.complete();
    }, 2000);
  }

  searchtag(tag) { // 태그만 검색하는 기능 검색창 및 현재 페이지에서 태그 클릭시 해당 페이지로 이동
    this.community.tag = tag;
    //this.appCtrl.getRootNavs()[0].push('SearchtagPage', { tag: this.tag });
    this.navCtrl.push('SearchtagPage', { tag: this.tag });
  }

  doInfinite() { // 다음 10개의 게시물 중 제일 위에 위치한 게시물의 스크롤에서부터 리스트 생성 
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.value1 = false;
    this.value2 = true;
    this.community.onInfiniteScroll().then((posts) => {
      this.posts = posts;
      let d = this.content.getContentDimensions();
      this.content.scrollTo(0, d.scrollHeight - 20);
      this.loading.dismiss();
    });
  }

}

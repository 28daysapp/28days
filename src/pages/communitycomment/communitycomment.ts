import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, PopoverController, LoadingController, Content, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunitycommentProvider } from '../../providers/communitycomment/communitycomment';
import firebase from 'firebase';
import { CommunityProvider } from '../../providers/community/community';


/**
 * Generated class for the CommunitycommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-communitycomment',
  templateUrl: 'communitycomment.html',
})
export class CommunitycommentPage {
  @ViewChild('content') content: Content;
  commentForm: FormGroup;
  updateForm: FormGroup;
  subcommentForm: FormGroup;
  public UserRef: firebase.database.Reference;
  public userList: Array<any>;
  public loadedUserList: Array<any>;
  public userList2: Array<any>;
  public loadedUserList2: Array<any>;
  comments;
  subcomments;
  commentid;
  commenttxt;
  loading;
  posts;
  post = this.community.post;
  comment = this.cocomment.comment;
  cancelbutton = true;
  title;
  tag = '';
  list_showsubcomment = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
    public popoverCtrl: PopoverController, private community: CommunityProvider,
    public loadingCtrl: LoadingController, public cocomment: CommunitycommentProvider,
    public viewCtrl: ViewController, public alertCtrl: AlertController,
    public zone: NgZone, public formBuilder: FormBuilder) {
    this.UserRef = firebase.database().ref('/users');
    // this event is published when any changes related to firebase comment data happen in CommunitycommentProvider
    this.events.subscribe('community-newcomment', () => {
      this.comments = [];
      this.subcomments = [];
      this.zone.run(() => {
        this.comments = this.cocomment.comments;
        this.commentid = this.cocomment.commentid;
        this.commenttxt = this.cocomment.text;
        this.setshowsubcomment(this.comments);
      });
    });

    // set validator for comment input form and subcomment input form
    // text must be required
    this.commentForm = formBuilder.group({
      txt: ['', Validators.required]
    });
    this.subcommentForm = formBuilder.group({
      txt: ['', Validators.required]
    });

  }

  initializeItems(): void {
    this.userList = this.loadedUserList;
    this.userList2 = this.loadedUserList2;
  }

  ionViewWillEnter(comment) {
    var postid = this.post.uid;
    this.UserRef.orderByChild('uid').equalTo(postid).on('value', userList => {
      let users = [];
      userList.forEach(user => {
        users.push(user.val());
        return false;
      });
      this.userList = users;
      this.loadedUserList = users;
    });
    /* 댓글 프로필 사진 - communitycomment -> postid -> commentid -> uid.................................................. 
    var commentid = this.comment.commentid.uid;
    this.UserRef.orderByChild('uid').equalTo(commentid).on('value', userList2 => {
      let usercomment = [];
      userList2.forEach(user2 => {
        usercomment.push(user2.val());
        return false;
      });
      this.userList2 = usercomment;
      this.loadedUserList2 = usercomment;
    });
    */
  }

  ionViewDidLoad() {
    this.cocomment.getallcomments();
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave - Communitycomment');
    this.events.unsubscribe('community-newcomment');
    this.events.unsubscribe('community-newsubcomment');
    this.cocomment.stoplistencomments();
  }

  /* user writes comment and push enter button */
  writeComment() {
    if (this.commentForm.valid) {
      var txt = this.commentForm.value.txt;
      this.commentForm.reset();
      this.cocomment.uploadcomment(txt);
    }
  }

  /* user clicks subcomment of a comment */
  showsubcomment(comment) {
    if (comment.showsubcomment) {
      comment.showsubcomment = false;
      // remove commentid from list of subcomments which were opened
      var index = this.list_showsubcomment.indexOf(comment.commentid);
      if (index > -1) {
        this.list_showsubcomment.splice(index, 1);
      }
    } else {
      comment.showsubcomment = true;
      // push commentid to list of subcomments which were opened
      //this.list_showsubcomment.push(comment.commentid);
      this.cocomment.getallsubcomments(comment);
    }
  }

  /* user writes subcomment and push enter button */
  writeSubcomment(comment) {
    if (this.subcommentForm.valid) {
      var txt = this.subcommentForm.value.txt;
      this.subcommentForm.reset();
      this.cocomment.uploadSubcomment(comment.commentid, txt);
    }
  }

  /*JSONtoArray(json) {
     return Object.keys(json).map(function(k) { return json[k] });
  }*/

  /* set previous state about whether subcomments were shown or not */
  setshowsubcomment(comments) {
    for (var i = 0; i < comments.length; i++) {
      if (this.list_showsubcomment.indexOf(comments[i].commentid) > -1) {
        comments[i].showsubcomment = true;
      }
    }
  }

  updatebutton(comment) {
    this.cancelbutton = true;
    comment.updatecomment = true;
    this.updateForm = this.formBuilder.group({
      txt: [comment.text, Validators.required]
    });
  }

  cancel(comment){
    let alert = this.alertCtrl.create({
      cssClass: 'deleteAlert', // alert css -> app.scss에서 수정가능

      message: '정말 취소하시겠습니까?',
      buttons: [
        {
          text: '예',
          handler: () => {
            this.cancelbutton = false;
            comment.updatecomment = false;
          }
        },
        {
          text: '아니요',
          role: 'cancel'
        },
      ]
    });
    alert.present();
  }

  updatecomment(comment) {
    var txt = this.updateForm.value.txt;
    this.updateForm.reset();
    //comment.updatecomment = false;
    this.cocomment.updatecomment(comment, txt);
  }

  deletecomment(comment) { // 댓글 삭제 기능 alert창 추가버전
    let alert = this.alertCtrl.create({
      cssClass: 'deleteAlert', // alert css -> app.scss에서 수정가능

      message: '정말 삭제하시겠습니까?',
      buttons: [
        {
          text: '확인',
          handler: () => {
            this.cocomment.deletecomment(comment);
          }
        },
        {
          text: '취소',
          role: 'cancel'
        },
      ]
    });
    alert.present();
  }

  like(post) { // 좋아요 내가 안해서 모름
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

  usercorrect_cmt(comment) { // 댓글의 수정 삭제 보이게하는 기능
    var correct = false;
    if (firebase.auth().currentUser.uid == comment.uid)
      correct = true;
    return correct;
  }

  reportuser_cmt(comment) { // 댓글의 신고버튼 보이게하는 기능
    var correct = true;
    if (firebase.auth().currentUser.uid == comment.uid)
      correct = false;
    return correct;
  }

  photomatch(user) { // 프로필사진 시도하던것 3
    var correct = false;
    var uid = firebase.auth().currentUser.uid;
    if (user.uid == uid) {
      correct = true;
    }
    return correct;
  }

  tagcheck(tag) { // 태그가 없을 때 # 안보이게하기
    var correct = false;
    if (tag != '') {
      correct = true;
    }
    return correct;
  }

  searchtag(tag) { // 게시글안에서 태그 클릭시 해당 태그 검색
    this.community.tag = tag;
    this.navCtrl.push("SearchtagPage", { tag: this.tag });
  }

  reportcomment(comment) { // 신고기능 항목은 많지만 다 그냥 카운트 올려주기만 함 ㅎ 중복체크도 못함 ㅎ
    let alert = this.alertCtrl.create({
      cssClass: 'reportAlert', // alert css -> app.scss에서 수정가능
      title: '신고항목',
      buttons: [
        {
          text: '비방/욕설',
          handler: () => {
            this.cocomment.reportcomment(comment);
            let alert = this.alertCtrl.create({
              cssClass: 'reportComplete',
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
            this.cocomment.reportcomment(comment);
            let alert = this.alertCtrl.create({
              cssClass: 'reportComplete',
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
            this.cocomment.reportcomment(comment);
            let alert = this.alertCtrl.create({
              cssClass: 'reportComplete',
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
            this.cocomment.reportcomment(comment);
            let alert = this.alertCtrl.create({
              cssClass: 'reportComplete',
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
            this.cocomment.reportcomment(comment);
            let alert = this.alertCtrl.create({
              cssClass: 'reportComplete',
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

  postdelete(post) { // 게시글 삭제기능
    let alert = this.alertCtrl.create({
      cssClass: 'deleteAlert',
      message: '정말 삭제하시겠습니까?',
      buttons: [
        {
          text: '확인',
          handler: () => {
            this.community.postdelete(post);
            this.navCtrl.pop();
          }
        },
        {
          text: '취소',
          role: 'cancel'
        },
      ]
    });
    alert.present();
  }

  updatepost(post) { // 게시글 수정버튼 클릭시 해당 페이지로 이동
    this.community.post = post;
    this.navCtrl.push('CommunityfixPage', {

    });
  }

  usercorrect(post) { // 게시글의 계정 매칭
    var correct = false;
    if (firebase.auth().currentUser.uid == post.uid) {
      correct = true;
    }
    return correct;
  }

  reportuser(post) {
    var correct = true;
    if (firebase.auth().currentUser.uid == post.uid) {
      correct = false;
    }
    return correct;
  }

  reportpost(post) { // 게시글 신고 댓글이랑 똑같음 ㅎ
    let alert = this.alertCtrl.create({
      cssClass: 'reportAlert',
      title: '',
      message: '신고항목',
      buttons: [
        {
          text: '비방/욕설',
          handler: () => {
            this.community.reportpost(post);
            let alert = this.alertCtrl.create({
              cssClass: 'reportComplete',
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
              cssClass: 'reportComplete',
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
              cssClass: 'reportComplete',
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
              cssClass: 'reportComplete',
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
              cssClass: 'reportComplete',
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

  imgexpansion(post) { // 사진 클릭시 사진확대 페이지로 이동
    this.navCtrl.push('ImgexpansionPage', { post: post });
  }

  changeAnonymity(post) { // 익명 판별
    var correct = false;
    if (post.anonymity == true) {
      correct = true;
    }
    else if (post.anonymity == false) {
      correct = false;
    }
    return correct;
  }

}

import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, PopoverController, LoadingController, Content, ViewController, AlertController  } from 'ionic-angular';
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
  comments;
  subcomments;
  commentid;
  commenttxt;
  loading;
  posts;
  post = this.community.post;
  title;
  list_showsubcomment = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
    public popoverCtrl: PopoverController, private community: CommunityProvider,
    public loadingCtrl: LoadingController, public cocomment: CommunitycommentProvider,
    public viewCtrl: ViewController, public alertCtrl: AlertController,
  	public zone: NgZone, public formBuilder: FormBuilder) {
    this.title = this.community.title;
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

  ionViewWillEnter() {

  }

  ionViewDidLoad() {
    this.cocomment.getallcomments();
  }

  ionViewWillLeave(){
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

  updatebutton(comment){
    comment.updatecomment = true;
    this.updateForm = this.formBuilder.group({
      txt: [comment.text, Validators.required]
    });
  }

  updatecomment(comment){
      var txt = this.updateForm.value.txt;
      this.updateForm.reset();
      //comment.updatecomment = false;
      this.cocomment.updatecomment(comment,txt);
  }

  deletecomment(comment){
    this.cocomment.deletecomment(comment);
  }

  usercorrect_cmt(comment){
    var correct = false;
    if(firebase.auth().currentUser.uid == comment.uid)
      correct = true;
    return correct;
  }

  reportuser_cmt(comment){
    var correct = true;
    if(firebase.auth().currentUser.uid == comment.uid)
      correct = false;
    return correct;
  }

  reportcomment(comment){
    let alert = this.alertCtrl.create({
      title: '',
      message: '신고항목',
      buttons: [
        {
          text: '비방/욕설',
          handler: () => {
              this.cocomment.reportcomment(comment);
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
              this.cocomment.reportcomment(comment);
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
              this.cocomment.reportcomment(comment);
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
              this.cocomment.reportcomment(comment);
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
              this.cocomment.reportcomment(comment);
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
            this.community.getallposts().then((posts) => {
              this.posts = posts;
              this.loading.dismiss();
            });
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

}

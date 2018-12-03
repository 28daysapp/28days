import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ViewController } from 'ionic-angular';
import { CounselorProvider } from '../../providers/counselor/counselor';
import { ChatProvider } from '../../providers/chat/chat';

@IonicPage()
@Component({
  selector: 'page-counselorreview',
  templateUrl: 'counselorreview.html',
})
export class CounselorreviewPage {
  @ViewChild('content') content: Content;

  type = 'profile';
  isProfile;
  isReview;

  user;
  reviews;
  review;
  count;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public counselor: CounselorProvider,
    public chat: ChatProvider,
    public viewCtrl: ViewController,
  ) {
    this.user = this.navParams.get("user");
    this.type = 'profile';

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CounselorreviewPage');
  }

  ionViewWillEnter() {
    if(this.type=='profile'){
      this.isProfile = true;
      this.isReview = false;
    }
    else {
      this.isProfile = false;
      this.isReview = true;
    }

    var promise = new Promise((resolve) => {
      this.counselor.getallreview(this.user.uid).then((reviews) => {
        this.reviews = reviews;
      }).then(() => {
      this.counselor.getcounselor(this.user.uid).then((supporter) => {
        this.user = supporter;
      });
    });
  });
    return promise;
  }

  changeType(){
    if(this.type=='profile'){
      this.isProfile = true;
      this.isReview = false;
    }
    else {
      this.isProfile = false;
      this.isReview = true;
    }
  }

  reviewwrite() {
    this.navCtrl.push('CounselorReviewWritePage',
      {
        user: this.user
      });
  }

  sendRequest() {
    this.chat.initializebuddy(this.user);
    this.navCtrl.push('CounselorchatPage').then(() => {
      var index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }

  makeRating(num) {
    var ratings = [];
    for (var i = 1; i < 6; i++) {
      var rating: any = {};
      if (i <= num) {
        rating.src = 'assets/star-full.png';
      } else {
        rating.src = 'assets/star.png';
      }
      ratings.push(rating);
    }
    return ratings;
  }

}


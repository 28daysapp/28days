import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content, PopoverController, ViewController, AlertController } from 'ionic-angular';
import { SupporterProvider } from '../../providers/supporter/supporter';
import { ChatProvider } from '../../providers/chat/chat';

/**
 * Generated class for the SupporterreviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-supporterreview',
  templateUrl: 'supporterreview.html',
})
export class SupporterreviewPage {
  @ViewChild('content') content: Content;

  type = 'profile';
  isProfile;
  isReview;

  user;
  loading;
  reviews;
  review;
  ratingsA;
  ratingsB;
  ratingsC;
  ratingsD;
  reviewnum;
  count;

  constructor(public navCtrl: NavController, public navParams: NavParams, public supporter: SupporterProvider,public chat: ChatProvider,
    public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {
    this.user = this.navParams.get("user");
    this.type = 'profile';
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupporterreviewPage');
  }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.supporter.getallreview(this.user.uid).then((reviews) => {
      this.reviews = reviews;
      console.log('SupporterPage - getallusersExceptbuddy - userprofiles : ' + JSON.stringify(this.reviews));
    });
    this.loading.dismiss();

    if(this.type=='profile'){
      this.isProfile = true;
      this.isReview = false;
    }
    else {
      this.isProfile = false;
      this.isReview = true;
    }
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
    this.navCtrl.push('SupporterreviewwritePage',
      {
        user: this.user
      });
  }

  sendRequest() {
    this.chat.initializebuddy(this.user);
    this.navCtrl.push('SupporterchatPage').then(() => {
      var index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }

  makeRating(num) {
    console.log('hi' + num);
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
    // console.log(JSON.stringify(ratings));
    return ratings;
  }

}

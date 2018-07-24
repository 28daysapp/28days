import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content, PopoverController, ViewController, AlertController } from 'ionic-angular';
import { SupporterProvider } from '../../providers/supporter/supporter';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public supporter: SupporterProvider,
    public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {
    this.user = this.navParams.get("user");
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupporterreviewPage');
  }

  ionViewWillEnter() {console.log('ionViewDidLoad SupporterreviewPag2e');
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.supporter.getallreview(this.user.uid).then((reviews) => {
      this.reviews = reviews;
      console.log('SupporterPage - getallusersExceptbuddy - userprofiles : ' + JSON.stringify(this.reviews));
      this.content.scrollToTop(0);
    });
    this.loading.dismiss();
  }

  reviewwrite() {
    this.navCtrl.push('SupporterreviewwritePage',
      {
        user: this.user
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

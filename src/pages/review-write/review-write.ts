import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ReviewProvider } from '../../providers/review/review';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-review-write',
  templateUrl: 'review-write.html',
})
export class ReviewWritePage {

  user;
  placeId;
  text;
  placeName;

  constructor(public navCtrl: NavController, public navParams: NavParams, public review: ReviewProvider, public loadingCtrl: LoadingController) {
    this.placeId = this.navParams.get('placeId');
    this.user = firebase.auth().currentUser;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewWritePage');
  }

  write() {

    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });

    loading.present();

	  this.review.writeReview(this.placeId, this.text).then(() => {
      console.log("여기까진 오냐???")
	  	this.navCtrl.pop();
    });
    

  }

}

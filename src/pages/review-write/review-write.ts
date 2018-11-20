import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, LoadingController, Slides } from 'ionic-angular';
import { ReviewProvider } from '../../providers/review/review';
import firebase from 'firebase';



@IonicPage()
@Component({
  selector: 'page-review-write',
  templateUrl: 'review-write.html',
})
export class ReviewWritePage {

  @ViewChild(Slides) slides: Slides;


  user;
  place;
  placeId;
  text;
  placeName;
  nextDisabled: boolean;
  writeDisabled: boolean;
  filledStars: boolean;
  likesrc = [];
  rating = [];

  count;


  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public review: ReviewProvider, public loadingCtrl: LoadingController,
  ) {
    this.place = this.navParams.get('place');
    this.user = firebase.auth().currentUser;
    this.placeId = this.place.place_id;
    this.placeName = this.place.name;

    this.count = 0;

    var arr1 = [0, 1, 2, 3, 4];
    var arr2 = [0, 1, 2, 3, 4];
    var arr3 = [0, 1, 2, 3, 4];
    var arr4 = [0, 1, 2, 3, 4];

    this.likesrc[0] = arr1;
    this.likesrc[1] = arr2;
    this.likesrc[2] = arr3;
    this.likesrc[3] = arr4;

    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 5; j++)
        this.likesrc[i][j] = 'assets/icon/star-empty.svg';
    }
  }

  ngAfterViewInit() {
    this.slides.freeMode = false;
    this.slides.lockSwipes(true);
    this.nextDisabled = true;
    this.writeDisabled = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewWritePage');
  }


  nextSlide() {
    this.filledStars = true;
    if (this.filledStars) {
      this.slides.lockSwipes(false);
    };
    this.slides.slideTo(2, 500);
    this.slides.lockSwipes(true);
  }

  like(item, num) {
    for (var i = num; i < 5; i++) {
      this.likesrc[item][i] = 'assets/icon/star-empty.svg';
    }
    for (i = num; i >= 0; i--) {
      this.likesrc[item][i] = 'assets/icon/star-filled.svg';
    }
    this.rating[item] = num + 1;

    if (this.rating[0] != null && this.rating[1] != null && this.rating[2] != null && this.rating[3] != null) {
      console.log('eh?')
      this.nextDisabled = null;
    }
  }

  write() {
    if (!this.text) {
      let alert = this.alertCtrl.create({
        'title': '후기 내용을 작성해주세요!',
        buttons: ['닫기']
      });
      alert.present();
    }

    if(this.placeId && this.rating && this.text != null) {
      this.review.createReview(this.placeId, this.placeName, this.rating, this.text).then(() => {
        this.navCtrl.pop();
      });
    }
  }

}

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Slides } from 'ionic-angular';
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
  filledStars: boolean;
  likesrc = [];
  rating = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public review: ReviewProvider, public loadingCtrl: LoadingController,
  ) {
    this.place = this.navParams.get('place');
    this.user = firebase.auth().currentUser;
    this.placeId = this.place.place_id;
    this.placeName = this.place.name;

    var arr1 = [0,1,2,3,4];
    var arr2 = [0,1,2,3,4];
    var arr3 = [0,1,2,3,4];
    var arr4 = [0,1,2,3,4];

    this.likesrc[0] = arr1;
    this.likesrc[1] = arr2;
    this.likesrc[2] = arr3;
    this.likesrc[3] = arr4;
    
    for(var i = 0; i < 4; i++){
      for(var j = 0; j < 5; j++)
      this.likesrc[i][j] = 'assets/star.png';
    }
  }

  ngAfterViewInit() {
    this.slides.freeMode = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewWritePage');
  }


  nextSlide() {
    this.slides.slideTo(2,500);
    this.filledStars = true;
  }

  like(item,num){
    for(var i = num; i < 5; i++){
      this.likesrc[item][i] = 'assets/icon/star-empty.svg';
    }
    for(i = num; i >= 0; i--){
      this.likesrc[item][i] = 'assets/icon/star-filled.svg';
    }
    this.rating[item] = num+1;
  }

  write() {

    // let loading = this.loadingCtrl.create({
    //   dismissOnPageChange: true,
    // });

    // loading.present();


    this.review.writeReview(this.placeId, this.rating, this.text).then(() => {
      this.navCtrl.pop();
    });



  }

}

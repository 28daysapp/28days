import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, LoadingController, Slides } from 'ionic-angular';
import { CounselorProvider } from '../../providers/counselor/counselor';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-counselor-review-write',
  templateUrl: 'counselor-review-write.html',
})
export class CounselorReviewWritePage {

  @ViewChild(Slides) slides: Slides;

  counselor;
  counselorName;
  text;
  nextDisabled: boolean;
  writeDisabled: boolean;
  filledStars: boolean;
  likesrc = [];
  rating = [];
  user

  count;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public Counselor: CounselorProvider, public loadingCtrl: LoadingController,) {
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
      this.likesrc[i][j] = 'assets/icon/star-empty.svg';
    }
    this.counselor = this.navParams.get("user");
    console.log('CounselorPage - getallusersExceptbuddy - userprofiles : ' + JSON.stringify(this.counselor));
    this.counselorName = this.counselor.username;
    this.user = firebase.auth().currentUser;
    console.log('CounselorPage - getallusersExceptbuddy - userprofiles : ' + JSON.stringify(this.user));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CounselorReviewWritePage');
  }

  ngAfterViewInit() {
    this.slides.freeMode = false;
    this.slides.lockSwipes(true);
    this.nextDisabled = true;
    this.writeDisabled = true;
  }

  nextSlide() {
    this.filledStars = true;
    if (this.filledStars) {
      this.slides.lockSwipes(false);
    };
    this.slides.slideTo(2, 500);
    this.slides.lockSwipes(true);
  }

  like(item,num){
    for(var i = num; i < 5; i++){
      this.likesrc[item][i] = 'assets/icon/star-empty.svg';
    }
    for(i = num; i >= 0; i--){
      this.likesrc[item][i] = 'assets/icon/star-filled.svg';
    }
    this.rating[item] = num+1;

    if (this.rating[0] != null && this.rating[1] != null && this.rating[2] != null && this.rating[3] != null) {
      console.log('eh?')
      this.nextDisabled = null;
    }
  }

  reviewwrite(){
    console.log('gg');
    if(!this.text) {
      let alert = this.alertCtrl.create({
            'title': '후기 내용을 작성해주세요!',
            buttons: ['닫기']
          });
          alert.present();
    }

    if(this.counselor.uid && this.rating && this.text != null) {
      this.Counselor.addcounselorreview(this.counselor.uid, this.rating[0], this.rating[1], this.rating[2], this.rating[3], this.text, this.user.displayName).then(() => {
        this.navCtrl.pop();
      });
    }
  }

}

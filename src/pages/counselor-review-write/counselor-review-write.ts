import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CounselorProvider } from '../../providers/counselor/counselor';
/**
 * Generated class for the CounselorReviewWritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-counselor-review-write',
  templateUrl: 'counselor-review-write.html',
})
export class CounselorReviewWritePage {

  likesrc = [];
  text;
  user;
  rating = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public counselor: CounselorProvider, public loadingCtrl: LoadingController) {
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
    this.user = this.navParams.get("user");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CounselorReviewWritePage');
  }

  like(item,num){
    for(var i = num; i < 5; i++){
      this.likesrc[item][i] = 'assets/star.png';
    }
    for(i = num; i >= 0; i--){
      this.likesrc[item][i] = 'assets/star-full.png';
    }
    this.rating[item] = num+1;
  }

  reviewwrite(){
    console.log('gg');
    this.counselor.addcounselorreview(this.user.uid, this.rating[0], this.rating[1], this.rating[2], this.rating[3], this.text).then(() => {
	  	this.navCtrl.pop();
	  });
	  let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    loading.present();
  }

}

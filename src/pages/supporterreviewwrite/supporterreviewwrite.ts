import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { SupporterProvider } from '../../providers/supporter/supporter';

/**
 * Generated class for the SupporterreviewwritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-supporterreviewwrite',
  templateUrl: 'supporterreviewwrite.html',
})
export class SupporterreviewwritePage {

  likesrc = [];
  text;
  user;
  rating = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public supporter: SupporterProvider, public loadingCtrl: LoadingController) {
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
    console.log('ionViewDidLoad SupporterreviewwritePage');
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
    this.supporter.addsupporterreview(this.user.uid, this.text, this.user.username).then(() => {
	  	this.navCtrl.pop();
	  });
	  let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    loading.present();
  }

  

  

}

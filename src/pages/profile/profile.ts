import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth/auth';
import { 
  IonicPage, 
  NavController, 
  NavParams, 
  AlertController,
  LoadingController,
} from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  loading;
  user;
  photoURL;
  currentUser = true;
  displayedCardsCount = 0;

  samplePostCards = [
    {
      communityName: "20대",
      postContent: "20대에 관련된 글입니다!",
      likeCount: "3",
      commentCount: "4",
      postTimeCreated: "11h"
    },
    {
      communityName: "우울증",
      postContent: "우울증에 관련된 글입니다!",
      likeCount: "3",
      commentCount: "4",
      postTimeCreated: "11h"
    },
    {
      communityName: "20대",
      postContent: "20대에 관련된 글입니다!",
      likeCount: "3",
      commentCount: "4",
      postTimeCreated: "11h"
    },
    {
      communityName: "20대",
      postContent: "20대에 관련된 글입니다!",
      likeCount: "3",
      commentCount: "4",
      postTimeCreated: "11h"
    },
    {
      communityName: "우울증",
      postContent: "우울증에 관련된 글입니다!",
      likeCount: "3",
      commentCount: "4",
      postTimeCreated: "11h"
    },
    {
      communityName: "20대",
      postContent: "20대에 관련된 글입니다!",
      likeCount: "3",
      commentCount: "4",
      postTimeCreated: "11h"
    },
    {
      communityName: "20대",
      postContent: "20대에 관련된 글입니다!",
      likeCount: "3",
      commentCount: "4",
      postTimeCreated: "11h"
    },
    {
      communityName: "우울증",
      postContent: "우울증에 관련된 글입니다!",
      likeCount: "3",
      commentCount: "4",
      postTimeCreated: "11h"
    },
    {
      communityName: "20대",
      postContent: "20대에 관련된 글입니다!",
      likeCount: "3",
      commentCount: "4",
      postTimeCreated: "11h"
    }
  ]
  displayedPostCards = []

  sampleJoinedCommunity = [
    {
      communityName: "우울증"
    },
    {
      communityName: "PTSD"
    },
    {
      communityName: "20대"
    },
    {
      communityName: "20대"
    },
    {
      communityName: "20대"
    }
  ]

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public userProvider: UserProvider
  ) {
    if (this.navParams.get('uid')) {
      this.user = this.navParams.get('uid');
      this.currentUser = false;
    } else {
      this.user = this.userProvider.readCurrentUser();
    }
  }

  ionViewWillLoad() {
    console.log('ionViewWillLoad - Home')
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ProfilePage');
    for (let i = this.displayedCardsCount; i < this.displayedCardsCount + 3; i++) {
      this.displayedPostCards.push(this.samplePostCards[i])
    }
    this.displayedCardsCount += 3;
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave ProfilePage');
    this.displayedPostCards = [];
    this.displayedCardsCount = 0;
  }

  navigateTo(component) {
    this.navCtrl.push(component);
  }

  goNotification(){
    if (this.user) {
      this.navCtrl.push('UserNotificationPage');
    } else {
      this.pleaselogin();
    }
  }

  pleaselogin() {
    let alert = this.alertCtrl.create({
      title: '로그인 후 사용하실 수 있습니다.',
      message: '코코넛에 로그인하시겠습니까?',
      buttons: [
        {
          text: '확인',
          handler: () => {
            this.navCtrl.push('LoginPage');
          }
        },
        {
          text: '취소',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      for (let i = this.displayedCardsCount; i < this.displayedCardsCount + 3; i++) {
        this.displayedPostCards.push(this.samplePostCards[i])
      }
      this.displayedCardsCount += 3;
      infiniteScroll.complete();
    }, 1000);
  }
}

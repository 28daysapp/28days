import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, Slides } from 'ionic-angular';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { NavParams, ModalController } from 'ionic-angular';
import { FCM } from '../../../node_modules/@ionic-native/fcm';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;

  /* Initialize variables */
  fireusers = firebase.database().ref('/users');
  loading;
  user;
  userprofile;
  username;
  photoURL;
  greeting;
  origGreeting;
  showmodal = false;
  token;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public auth: AuthProvider, public userProvider: UserProvider,
    public storage: Storage, public loadingCtrl: LoadingController, public params: NavParams, public modalCtrl: ModalController, public fcm: FCM) {
    // Receive message from push notifications
    if (params.data.message) {
      console.log('message: ' + params.data.message);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad - Home')
    // present loading
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    // set defualt user photo
    this.photoURL = 'assets/profile0.png';

    // check if user already logged-in
    this.user = firebase.auth().currentUser;
    if (this.user) {
      // user already logged-in
      console.log('this.user: ' + this.user.displayName + '/' + this.user.photoURL);
      this.username = this.user.displayName;
      this.photoURL = this.user.photoURL;

      this.userProvider.getUserprofile(this.user.uid).then((userprofile) => {
        console.log("user profile");
        console.log(JSON.stringify(userprofile));
        this.userprofile = userprofile;
        this.greeting = this.userprofile.greeting;
        this.loading.dismiss();
      })
    } else {
      // check if cache info exists in local storage
      this.storage.get('localcred').then((localcred) => {
        if (localcred) {
          // cache exists
          this.auth.loginUser(localcred.email, localcred.password).then((user) => {
            console.log('Home - ionViewDidLoad - load token ' + user.displayName + '/' + user.photoURL);
            this.user = user;
            this.username = this.user.displayName;
            this.photoURL = this.user.photoURL;

            this.userProvider.getUserprofile(this.user.uid).then((userprofile) => {
              console.log("user profile");
              console.log(JSON.stringify(userprofile));
              this.userprofile = userprofile;
              this.greeting = this.userprofile.greeting;
              this.loading.dismiss();
            });
          });
        } else {
          // cache not found
          // get username which is typed by user in Intro
          this.storage.get('username').then((username) => {
            if (username) {
              this.username = username;
            } else {
              this.username = '28days';
            }
            this.greeting = "안녕하세요! " + this.username + " 입니다. 함께 나아가요!"
            this.loading.dismiss();
          });
        }
      });
    }
  }

  getToken() {
    console.log("get token start");
    if (this.user) {
      console.log("token logged in")
      var uid = firebase.auth().currentUser.uid;
      this.fcm.getToken().then(token => {
        console.log("HomePage Token: " + token);
        this.token = token;
        var promise = new Promise((resolve) => { 
          this.fireusers.child(uid).update({
            token: this.token
          });
          resolve(true);
        });
        return promise;
      }) 
    }
    console.log("get token end");
  }

  deleteToken() {
    console.log("delete token start");
    if (this.user) {
      console.log("token logged in")
      var uid = firebase.auth().currentUser.uid;
      this.fcm.getToken().then(token => { 
        this.token = token;
      });
      var promise = new Promise((resolve) => { 
        this.fireusers.child(`${uid}/token`).remove();
        resolve(true);
      });
      return promise;
    }
    console.log("delete token end");
  }


  mypage() {
    if (this.user) {
      this.navCtrl.push('MypagePage');
    } else {
      this.pleaselogin();
    }
  }

  changecharacter() {
    if (this.user) {
      this.navCtrl.push('CharacterPage');
    } else {
      this.pleaselogin();
    }
  }

  changename() {
    if (this.user) {
      // this.navCtrl.push('SupporterPage');
    } else {
      this.pleaselogin();
    }
  }

  changegreeting() {
    if (this.user) {
      // this.navCtrl.push('SupporterPage');
      setTimeout(() => {
        this.origGreeting = this.greeting;
        this.showmodal = true;
      }, 500);
    } else {
      this.pleaselogin();
    }
  }

  community() {
    if (this.user) {
      this.navCtrl.push('CommunityPage');
    } else {
      this.pleaselogin();
    }
  }

  supporter() {
    if (this.user) {
      // this.navCtrl.push('GogosupporterPage');
      this.navCtrl.push('SupporterPage');
    } else {
      this.pleaselogin();
    }
  }

  post() {
    if (this.user) {
      this.navCtrl.push('PostPage');
    } else {
      this.pleaselogin();
    }
  }

  meditate() {
    if (this.user) {
      this.navCtrl.push('MeditatePage');
    } else {
      this.pleaselogin();
    }
  }

  searchhelp() {
    this.navCtrl.push('SearchhelpPage');
  }

  test() {
    this.navCtrl.push('TestPage');
  }

  diary() {
    if (this.user) {
      this.navCtrl.push('DiaryPage');
    } else {
      this.pleaselogin();
    }
  }

  emotionbasket() {
    if (this.user) {
      this.navCtrl.push('EmotionbasketPage');
    } else {
      this.pleaselogin();
    }
  }

  pleaselogin() {
    let alert = this.alertCtrl.create({
      title: '로그인 후 사용하실 수 있습니다.',
      message: '28days에 로그인하시겠습니까?',
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

  gogo() {
    this.navCtrl.push('GogohomePage');
  }

  modalhandler(modal) {
    this.greeting = modal.value.greeting;
    this.showmodal = false;
    this.userProvider.updateGreeting(modal.value.greeting).then(() => { });
  }

  dismissModal() {
    this.showmodal = false;
    this.greeting = this.origGreeting;
  }

  counseling() {
    this.navCtrl.push('SearchPage', {
      type: "c"
    });
  }

  psychiatric() {
    this.navCtrl.push('SearchPage', {
      type: "p"
    });
  }


}

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, Slides, MenuController, Events } from 'ionic-angular';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { FcmProvider } from '../../providers/fcm/fcm';
import { Storage } from '@ionic/storage';
import { NavParams, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';


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
  count;
  constructor(public events: Events, public navCtrl: NavController, public alertCtrl: AlertController, public auth: AuthProvider, public userProvider: UserProvider, public fcmProvider: FcmProvider,
    public storage: Storage, public loadingCtrl: LoadingController, public params: NavParams, public modalCtrl: ModalController, public http: Http, public menu: MenuController) {
    // Receive message from push notifications
    if (params.data.message) {
      console.log('message: ' + params.data.message);
    }
  }



  ionViewWillLoad() {
    console.log('ionViewDidLoad - Home')
    // present loading
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    // set defualt user photo
    this.photoURL = 'assets/profile0.png';

    // check if user already logged-in
    this.user = firebase.auth().currentUser;
    if (this.user) {

      try {
        this.fcmProvider.setToken(this.user);
      } catch (error) {
        console.log(error)
      }

      this.username = this.user.displayName;
      this.photoURL = this.user.photoURL;

      this.userProvider.getUserprofile(this.user.uid).then((userprofile) => {
        console.log(JSON.stringify(userprofile));
        this.userprofile = userprofile;
        this.greeting = this.userprofile.greeting;
        this.loading.dismiss();
        this.createUser();
        this.menu.enable(true, 'loggedInMenu');
        this.menu.enable(false, 'loggedOutMenu');
      })
    } else {

      // check if cache info exists in local storage
      this.storage.get('localcred').then((localcred) => {
        if (localcred) {
          // cache exists
          this.auth.loginUser(localcred.email, localcred.password).then((user) => {
            this.user = user;
            this.username = this.user.displayName;
            this.photoURL = this.user.photoURL;

            try {
              this.fcmProvider.setToken(this.user);
            } catch (error) {
              console.log(error)
            }
            this.userProvider.getUserprofile(this.user.uid).then((userprofile) => {
              this.userprofile = userprofile;
              this.greeting = this.userprofile.greeting;
              this.loading.dismiss();
              this.createUser();
              this.menu.enable(true, 'loggedInMenu');
              this.menu.enable(false, 'loggedOutMenu');
            });
          });
        } else {
          this.loading.dismiss();
        }
      });
    }
  }

  createUser() {
    console.log('User created!')
    this.events.publish('user:created', this.user, Date.now());
  }

  sendFCM() {
    // this.fcmProvider.sendFcm(this.user);
    // this.http.get('https://us-central1-days-fd14f.cloudfunctions.net/sendMessage')
    // .subscribe((data) => {
    //   console.log('data', data);
    // })
  }

  mypage() {
    if (this.user) {
      this.navCtrl.push('MypagePage');
    } else {
      this.pleaselogin();
    }
  }


<<<<<<< HEAD
  goNotification(){
    if (this.user) {
      this.navCtrl.push('UserNotificationPage');
    } else {
      this.pleaselogin();
    }
=======
  goNotification() {
    let alert = this.alertCtrl.create({
      title: '알림',
      message: '아직 준비중인 서비스입니다.',
      buttons: [
        {
          text: '확인',
          role: 'cancel'
        },
      ]
    });
    alert.present();
>>>>>>> 19554561a958017c6be6e3938048934a3ddb11e1
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

  modalhandler(modal) {
    this.greeting = modal.value.greeting;
    this.showmodal = false;
    this.userProvider.updateGreeting(modal.value.greeting).then(() => { });
  }

  dismissModal() {
    this.showmodal = false;
    this.greeting = this.origGreeting;
  }

  counselling() {
    let alert = this.alertCtrl.create({
      title: '알림',
      message: '아직 준비중인 서비스입니다.',
      buttons: [
        {
          text: '확인',
          role: 'cancel'
        },
      ]
    });
    alert.present();
  }

  nuts() {
    let alert = this.alertCtrl.create({
      title: '알림',
      message: '아직 준비중인 서비스입니다.',
      buttons: [
        {
          text: '확인',
          role: 'cancel'
        },
      ]
    });
    alert.present();
  }
}

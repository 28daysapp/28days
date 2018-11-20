import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, Navbar } from 'ionic-angular';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { NavParams, ModalController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-mypage',
  templateUrl: 'mypage.html',
})
export class MypagePage {
  @ViewChild(Navbar) navBar: Navbar;
  loading;
  user;
  userprofile;
  username;
  photoURL;
  greeting;
  operator;
  origGreeting;
  showmodal = false;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public auth: AuthProvider, public userProvider: UserProvider,
    public storage: Storage, public loadingCtrl: LoadingController, public params: NavParams, public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchtagPage');
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.pop();
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
        if(this.userprofile.operator == true){
          this.operator = true;
        }
        else
          this.operator = false;
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

  loginpage() {
    if (this.user) {
      let alert = this.alertCtrl.create({
        title: '로그아웃 하시겠습니까?',
        buttons: [
          {
            text: '확인',
            handler: () => {
              // log out from firebase auth service and remove previous cache about user credential
              this.auth.logoutUser().then(() => {
                this.storage.remove('localcred').then(() => {
                  // this.navCtrl.setRoot('TabsPage', {}, {animate: true, direction: 'forward'});
                  this.navCtrl.push('LoginPage');
                });
              });
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
    } else {
      this.navCtrl.push('LoginPage');
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
    this.userProvider.updateGreeting(modal.value.greeting).then(() => {});
  }

  dismissModal() {
    this.showmodal = false;
    this.greeting = this.origGreeting;
  }
  
  profile(){
    if (this.user) {
      this.navCtrl.push('CharacterPage');
    } else {
      this.pleaselogin();
    }
  }

  gogoOperator(){
    this.navCtrl.push('OperatorPage');
  }

  mypost(){
    if (this.user) {
      this.navCtrl.push('MypostPage');
    } else {
      this.pleaselogin();
    }
  }

  terms1(){
    if (this.user) {
      this.navCtrl.push('PersonalInformationPage');
    } else {
      this.pleaselogin();
    }
  }

  terms2(){
    if (this.user) {
      this.navCtrl.push('TermsUsePage');
    } else {
      this.pleaselogin();
    }
  }

  pwdchange(){
    if (this.user) {
      this.navCtrl.push('PwdcheckPage');
    } else {
      this.pleaselogin();
    }
  }
}

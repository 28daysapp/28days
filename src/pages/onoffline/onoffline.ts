import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, App } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { SupporterProvider } from '../../providers/supporter/supporter'
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-onoffline',
  templateUrl: 'onoffline.html',
})
export class OnofflinePage {
  type = 'Supporter';

  public userList: Array<any>;
  public loadedUserList: Array<any>;
  public SupporterRef: firebase.database.Reference;
  public CounselorRef: firebase.database.Reference;

  q;
  user;
  isSupporter;
  isCounselor;
  loading;

  constructor( public navCtrl: NavController, public navParams: NavParams, public chat: ChatProvider,
    public viewCtrl: ViewController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public appCrtl: App,
    public supporter: SupporterProvider) {

    this.SupporterRef = firebase.database().ref('/supporter');
    this.CounselorRef = firebase.database().ref('/counselor');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnofflinePage');
    this.user = firebase.auth().currentUser;
  }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    if (this.type == 'Supporter') {
      this.isSupporter = true;
      this.isCounselor = false;
      this.SupporterRef.on('value', userList => {
        let users = [];
        userList.forEach(user => {
          if (user.val().uid != this.user.uid) {
            users.push(user.val());
          } 
          return false;
        });
        this.userList = users;
        this.loadedUserList = users;
      });
    }
    if (this.type == 'Counselor') {
      this.isSupporter = false;
      this.isCounselor = true;
      this.CounselorRef.on('value', userList => {
        let users = [];
        userList.forEach(user => {
          if (user.val().uid != this.user.uid) {
            users.push(user.val());
          }
          return false;
        });
        this.userList = users;
        this.loadedUserList = users;
      });
    }
    this.loading.dismiss();
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    this.q = searchbar.srcElement.value;


    // if the value is an empty string don't filter the items
    if (!this.q) {
      return;
    }

    this.userList = this.userList.filter((v) => {
      if (v.username && this.q || v.uid && this.q) {
        if (v.username.toLowerCase().indexOf(this.q.toLowerCase()) > -1 || v.uid.toLowerCase().indexOf(this.q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  initializeItems(): void {
    this.userList = this.loadedUserList;
  }

  getList() {
    if (this.type == 'Supporter') {
      this.isSupporter = true;
      this.isCounselor = false;
      this.SupporterRef.on('value', userList => {
        let users = [];
        userList.forEach(user => {
          if (user.val().uid != this.user.uid) {
            users.push(user.val());
          }
          return false;
        });
        this.userList = users;
        this.loadedUserList = users;
      });
      if (this.q) {
        this.userList = this.userList.filter((v) => {
          if (v.username && this.q || v.uid && this.q) {
            if (v.username.toLowerCase().indexOf(this.q.toLowerCase()) > -1 || v.uid.toLowerCase().indexOf(this.q.toLowerCase()) > -1) {
              return true;
            }
            return false;
          }
        });
      }
    }
    if (this.type == 'Counselor') {
      this.isSupporter = false;
      this.isCounselor = true;
      this.CounselorRef.on('value', userList => {
        let users = [];
        userList.forEach(user => {
          users.push(user.val());
          return false;
        });
        this.userList = users;
        this.loadedUserList = users;
      });
      if (this.q) {
        this.userList = this.userList.filter((v) => {
          if (v.username && this.q || v.uid && this.q) {
            if (v.username.toLowerCase().indexOf(this.q.toLowerCase()) > -1 || v.uid.toLowerCase().indexOf(this.q.toLowerCase()) > -1) {
              return true;
            }
            return false;
          }
        });
      }
    }
  }



  

  supporterreview(user) {
    //this.appCrtl.getRootNavs()[0].push('SupporterreviewPage',{ user: user });
    this.navCtrl.push('SupporterreviewPage', { user: user });
  }

  counselorreview(user) {
    //this.appCrtl.getRootNavs()[0].push('CounselorreviewPage',{ user: user });
    this.navCtrl.push('CounselorreviewPage', { user: user });
  }


  notReady() {
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
    this.type = 'Supporter';
    this.isSupporter = true;
    this.isCounselor = false;
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.ionViewWillEnter();
      refresher.complete();
    }, 2000);
  }
  //탭까지 같이 보내기
  /*
  supporterreview(user) { 
    this.navCtrl.push('SupporterreviewPage',
      {
        user: user
      });
  }

  counselorreview(user) {
    this.navCtrl.push('SupporterreviewPage',
      {
        user: user
      });
  }
  gooperator() {
    this.navCtrl.push('OperatorPage');
  }*/


  /*
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
  */
  // searchload() {
  //   this.navCtrl.push('SearchhelpPage');
  // }

}

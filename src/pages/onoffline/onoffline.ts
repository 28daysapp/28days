import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { SupporterProvider } from '../../providers/supporter/supporter'
import { UserProvider } from '../../providers/user/user'
import firebase from 'firebase';


/**
 * Generated class for the OnofflinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public chat: ChatProvider,
    public viewCtrl: ViewController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public supporter: SupporterProvider, public userp: UserProvider) {

    this.SupporterRef = firebase.database().ref('/supporter');
    this.CounselorRef = firebase.database().ref('/counselor');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnofflinePage');
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

    console.log(this.q, this.userList.length);
  }

  initializeItems(): void {
    this.userList = this.loadedUserList;
  }

  getList() {
    if (this.type == 'Supporter') {
      this.SupporterRef.on('value', userList => {
        let users = [];
        userList.forEach(user => {
          users.push(user.val());
          return false;
        });
        this.userList = users;
        this.loadedUserList = users;
      });
      if(this.q){
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
      this.CounselorRef.on('value', userList => {
        let users = [];
        userList.forEach(user => {
          users.push(user.val());
          return false;
        });
        this.userList = users;
        this.loadedUserList = users;
      });
      if(this.q){
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



  ionViewWillEnter() {
    if (this.type == 'Supporter') {
      this.SupporterRef.on('value', userList => {
        let users = [];
        userList.forEach(user => {
          users.push(user.val());
          return false;
        });
        this.userList = users;
        this.loadedUserList = users;
      });
    }
    if (this.type == 'Counselor') {
      this.CounselorRef.on('value', userList => {
        let users = [];
        userList.forEach(user => {
          users.push(user.val());
          return false;
        });
        this.userList = users;
        this.loadedUserList = users;
      });
    }

  }
  supporterreview(user) {
    this.navCtrl.push('SupporterreviewPage',
      {
        user: user
      });
  }
  gooperator() {
    this.navCtrl.push('OperatorPage');
  }

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

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { SupporterProvider } from '../../providers/supporter/supporter'
import firebase from 'firebase';

/**
 * Generated class for the SupporterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-supporter',
  templateUrl: 'supporter.html',
})
export class SupporterPage {
  type = 'supporter';
  
  firesupporterreviewsum = firebase.database().ref('/supporterreviewsum');
  public userList: Array<any>;
  public loadedUserList: Array<any>;
  public UserRef: firebase.database.Reference;

  constructor(public navCtrl: NavController, public navParams: NavParams, public chat: ChatProvider,
    public viewCtrl: ViewController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public supporter: SupporterProvider
  ) {
    this.UserRef = firebase.database().ref('/users');
  }
  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;


    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.userList = this.userList.filter((v) => {
      if (v.username && q || v.uid && q) {
        if (v.username.toLowerCase().indexOf(q.toLowerCase()) > -1 || v.uid.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  initializeItems(): void {
    this.userList = this.loadedUserList;
  }
  ionViewWillEnter() {
    this.UserRef.on('value', userList => {
      let users = [];
      userList.forEach(user => {
        users.push(user.val());
        return false;
      });
      this.userList = users;
      this.loadedUserList = users;
    });
  }
  supporterreview(user) {
    this.navCtrl.push('SupporterreviewPage',
      {
        user: user
      });
  }
  gooperator(){
    this.navCtrl.push('OperatorPage');
  }
  
}
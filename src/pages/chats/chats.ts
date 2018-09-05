import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  requestedinfos;
  requestinfos;
  user;
  query;

  type: string = "requested";

  constructor(public navCtrl: NavController, public navParams: NavParams, public chat: ChatProvider, public appCrtl: App,
    public userProvider: UserProvider) {
    this.user = firebase.auth().currentUser;

  }

  ionViewDidLoad() {
    this.chat.getallRequestedinfos().then((info) => {
      this.requestedinfos = info;
    });
    this.chat.getallRequestinfos().then((info) => {
      this.requestinfos = info;
    });
  }


  filterItems(event) {
    console.log(event.target.value);
  }

  getChatList() {
    const chatType = this.type;
    console.log("Chat type: " + chatType);
  }

  supporterChat(item) {
    this.userProvider.getUserprofile(item.buddyuid).then((userprofile) => {
      this.chat.initializebuddy(userprofile);

      this.appCrtl.getRootNavs()[0].push('SupporterchatPage');

      // this.navCtrl.push('SupporterchatPage');
    });
  }

  deleteSupporterChat(item) {
    this.chat.deleteChat(item.buddyuid).then(() => {
      this.chat.getallRequestinfos().then((info) => {
        this.requestinfos = info;
      });
    });
  }

  writeReview(item) {
    this.navCtrl.push('SupporterreviewwritePage',
      {
        user: this.user,
        buddy: item
      });
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  requestedinfos;
  requestinfos;

  type: string = "requested";

  constructor(public navCtrl: NavController, public navParams: NavParams, public chat: ChatProvider,
    public user: UserProvider) {
  }

  ionViewDidLoad() {
    this.chat.getallRequestedinfos().then((info) => {
      this.requestedinfos = info;
    });
    this.chat.getallRequestinfos().then((info) => {
      this.requestinfos = info;
    });
  }

  getItems(searchbar){
    console.log(searchbar);
  }

  getChatList() {
    const chatType = this.type;
    console.log("Chat type: " + chatType);
  }

  supporterchat(item) {
    this.user.getUserprofile(item.buddyuid).then((userprofile) => {
      this.chat.initializebuddy(userprofile);
      this.navCtrl.push('SupporterchatPage');
    });
  }

  deleteSupporterChat(item) {
    this.chat.deleteChat(item.buddyuid).then(() => {
      this.chat.getallRequestinfos().then((info) => {
        this.requestinfos = info;
      });
    });
  }
}

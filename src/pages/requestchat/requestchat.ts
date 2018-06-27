import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the RequestchatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-requestchat',
  templateUrl: 'requestchat.html',
})
export class RequestchatPage {
	requestinfos;
  constructor(public navCtrl: NavController, public navParams: NavParams, public chat: ChatProvider,
    public user: UserProvider) {
  }

  ionViewDidLoad() {
    this.chat.getallRequestinfos().then((info) => {
      this.requestinfos = info;
    });
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

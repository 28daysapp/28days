import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the RequestedchatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-requestedchat',
  templateUrl: 'requestedchat.html',
})
export class RequestedchatPage {
  requestedinfos;
  constructor(public navCtrl: NavController, public navParams: NavParams, public chat: ChatProvider,
    public user: UserProvider) {
  }

  ionViewDidLoad() {
    this.chat.getallRequestedinfos().then((info) => {
      this.requestedinfos = info;
    });
  }

  supporterchat(item) {
    this.user.getUserprofile(item.buddyuid).then((userprofile) => {
      this.chat.initializebuddy(userprofile);
      this.navCtrl.push('SupporterchatPage');
    });
  }

}

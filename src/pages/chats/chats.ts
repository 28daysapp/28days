import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  App,
  LoadingController
} from "ionic-angular";
import { ChatProvider } from "../../providers/chat/chat";
import { UserProvider } from "../../providers/user/user";
import firebase from "firebase";

@IonicPage()
@Component({
  selector: "page-chats",
  templateUrl: "chats.html"
})
export class ChatsPage {
  requestedInfos;
  requestInfos;
  user;
  query;
  loading;

  count: string = "0";
  type: string = "request";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public chat: ChatProvider,
    public appCrtl: App,
    public userProvider: UserProvider,
    public loadingCtrl: LoadingController
  ) {
    this.user = firebase.auth().currentUser;
  }

  ionViewDidLoad() {
    this.refreshList();
  }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.refreshList();
    this.loading.dismiss();
  }

  refreshList() {
    this.chat.getAllRequestedInfos().then(info => {
      console.log(info);
      this.requestedInfos = info;
      this.requestedInfos.forEach(info => {
        this.count = info.count;
      });
    });
    this.chat.getAllRequestInfos().then(info => {
      this.requestInfos = info;
      this.requestInfos.forEach(info => {
        this.count = info.count;
      });
    });
  }

  getChatList() {
    const chatType = this.type;
    return chatType === "requested"
      ? this.chat.getAllRequestInfos().then(info => {
          this.requestInfos = info;
        })
      : this.chat.getAllRequestedInfos().then(info => {
          this.requestedInfos = info;
        });
  }

  supporterChat(item) {
    this.userProvider.getUserprofile(item.buddyuid).then(userprofile => {
      console.info("Receiving Token2: " + JSON.stringify(userprofile));
      this.chat.initializebuddy(userprofile);
      this.navCtrl.push("SupporterchatPage");
    });
  }

  supporterChat2(item) {
    this.userProvider.getUserprofile(item.requester).then(userprofile => {
      console.info("Receiving Token333: " + JSON.stringify(userprofile));
      this.chat.initializebuddy(userprofile);
      this.navCtrl.push("SupporterchatPage");
    });
  }

  deleteSupporterChat(item) {
    this.chat.deleteChat(item.buddyuid).then(() => {
      this.chat.getAllRequestInfos().then(info => {
        this.requestInfos = info;
      });
    });
  }

  writeReview(item) {
    this.navCtrl.push("SupporterreviewwritePage", {
      user: this.user,
      buddy: item
    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.ionViewWillEnter();
      refresher.complete();
    }, 2000);
  }
}

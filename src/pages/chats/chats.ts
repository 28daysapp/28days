import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App } from "ionic-angular";
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

  type: string = "requested";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public chat: ChatProvider,
    public appCrtl: App,
    public userProvider: UserProvider
  ) {
    this.user = firebase.auth().currentUser;
  }

  ionViewDidLoad() {
    this.chat.getAllRequestedInfos().then(info => {
      this.requestedInfos = info;
    });
    this.chat.getAllRequestInfos().then(info => {
      this.requestInfos = info;
    });
  }

  filterItems(event) {
    console.log(event.target.value);
  }

  getChatList() {
    const chatType = this.type;
    console.log("Chat type: " + chatType);
    // return chatType === "requested"
    //   ? this.chat.getAllRequestInfos().then(info => {
    //       this.requestinfos = info;
    //     })
    //   : this.chat.getAllRequestedInfos().then(info => {
    //       this.requestedinfos = info;
    //     });
  }

  supporterChat(item) {
    this.userProvider.getUserprofile(item.buddyuid).then(userprofile => {
      this.chat.initializebuddy(userprofile);
      this.appCrtl.getRootNavs()[0].push("SupporterchatPage");
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
}

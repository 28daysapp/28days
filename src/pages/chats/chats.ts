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
    this.refreshList()
  }

  ionViewWillEnter() {
    this.refreshList();
  }

  filterItems(event) {
    console.log(event.target.value);
  }

  refreshList() {
    this.chat.getAllRequestedInfos().then(info => {
      this.requestedInfos = info;
      console.log("요청받은 requestedInfos: " + JSON.stringify(info))
    });
    this.chat.getAllRequestInfos().then(info => {
      this.requestInfos = info;
      console.log("요청한 requestInfos: " + JSON.stringify(info))
    });
  }

  getChatList() {
    const chatType = this.type;
    console.log("Chat type: " + chatType);
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

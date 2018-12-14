import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  LoadingController,
  AlertController,
  App
} from "ionic-angular";
import { ChatProvider } from "../../providers/chat/chat";
import { SupporterProvider } from "../../providers/supporter/supporter";
import firebase from "firebase";

@IonicPage()
@Component({
  selector: "page-supporter-list",
  templateUrl: "supporter-list.html"
})
export class SupporterListPage {
  public userList: Array<any>;
  public loadedUserList: Array<any>;
  public SupporterRef: firebase.database.Reference;
  public CounselorRef: firebase.database.Reference;

  searchQuery;
  user;
  isSupporter;
  loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public chat: ChatProvider,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public appCrtl: App,
    public supporter: SupporterProvider
  ) {
    this.SupporterRef = firebase.database().ref("/supporter");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SupporterListPage");
    this.user = firebase.auth().currentUser;
  }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.SupporterRef.on("value", userList => {
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

    this.loading.dismiss();
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set searchQuery to the value of the searchbar
    this.searchQuery = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!this.searchQuery) {
      return;
    }

    this.userList = this.userList.filter(v => {
      if ((v.username && this.searchQuery) || (v.uid && this.searchQuery)) {
        if (
          v.username.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >
            -1 ||
          v.uid.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
        ) {
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
    this.SupporterRef.on("value", userList => {
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
    if (this.searchQuery) {
      this.userList = this.userList.filter(v => {
        if ((v.username && this.searchQuery) || (v.uid && this.searchQuery)) {
          if (
            v.username.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >
              -1 ||
            v.uid.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
          ) {
            return true;
          }
          return false;
        }
      });
    }
  }

  supporterreview(user) {
    this.navCtrl.push("SupporterreviewPage", { user: user });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.ionViewWillEnter();
      refresher.complete();
    }, 2000);
  }
}

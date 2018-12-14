import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  AlertController,
  LoadingController
} from "ionic-angular";
import firebase from "firebase";
import { AuthProvider } from "../../providers/auth/auth";
import { UserProvider } from "../../providers/user/user";
import { Storage } from "@ionic/storage";
import { NavParams, ModalController } from "ionic-angular";

/**
 * Generated class for the MyprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-myprofile",
  templateUrl: "myprofile.html"
})
export class MyprofilePage {
  loading;
  user;
  userprofile;
  username;
  photoURL;
  greeting;
  origGreeting;
  showmodal = false;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public auth: AuthProvider,
    public userProvider: UserProvider,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public params: NavParams,
    public modalCtrl: ModalController
  ) {
    // Receive message from push notifications
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad MyprofilePage");
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    // set defualt user photo
    this.photoURL = "assets/imgs/post5.jpg";

    // check if user already logged-in
    this.user = firebase.auth().currentUser;
    // user already logged-in
    this.username = this.user.displayName;
    this.photoURL = this.user.photoURL;

    this.userProvider.getUserprofile(this.user.uid).then(userprofile => {
      this.userprofile = userprofile;
      this.greeting = this.userprofile.greeting;
      this.loading.dismiss();
    });
  }

  changecharacter() {
    this.navCtrl.push("CharacterPage");
  }

  changegreeting() {
    // this.navCtrl.push('SupporterPage');
    setTimeout(() => {
      this.origGreeting = this.greeting;
      this.showmodal = true;
    }, 500);
  }
  modalhandler(modal) {
    this.greeting = modal.value.greeting;
    this.showmodal = false;
    this.userProvider.updateGreeting(modal.value.greeting).then(() => {});
  }

  dismissModal() {
    this.showmodal = false;
    this.greeting = this.origGreeting;
  }

  pwdcheck() {
    this.navCtrl.push("PwdcheckPage");
  }
}

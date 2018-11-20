import { Component, ViewChild } from "@angular/core";
import {
  AlertController,
  Nav,
  Platform,
  Events
} from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import firebase from "firebase";
import { FirstRunPage } from "../pages";
import { AuthProvider } from "../providers/auth/auth";
import { Storage } from "@ionic/storage";

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
}

export const firebaseConfig = {
  apiKey: "AIzaSyBz5qFakcahaCIdkR1XbDemZEJc37-l7vs",
  authDomain: "days-fd14f.firebaseapp.com",
  databaseURL: "https://days-fd14f.firebaseio.com",
  projectId: "days-fd14f",
  storageBucket: "days-fd14f.appspot.com",
  messagingSenderId: "209011208541"
};

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;
  user;
  userprofile;
  username;
  email;
  lastBack;
  allowClose;
  photoURL;
  rootPage = FirstRunPage;

  pages: any[] = [
    { title: "Community", component: "CommunityPage" },
    { title: "Supporter", component: "SupporterPage" },
    { title: "Tabs", component: "TabsPage" },
    { title: "Home", component: "HomePage" },
    { title: "My Page", component: "MypagePage" }
  ];
  appPages: PageInterface[] = [
    {
      title: "보관함",
      component: "MydepositoryPage",
      icon: "assets/bookmark.svg"
    },
    {
      title: "내 커뮤니티 글",
      component: "MypostPage",
      icon: "assets/browser.svg"
    },
    { title: "결제 내역", component: "PaymentPage", icon: "assets/nuts.svg" },
    { title: "설정", component: "MypagePage", icon: "assets/setting.svg" }
  ];

  loggedOutPages: PageInterface[] = [
    { title: "로그인", component: "LoginPage", icon: "log-in" }
  ];
  loggedOutPages2: PageInterface[] = [
    { title: "회원가입", component: "SignupPage", icon: "person-add" }
  ];

  constructor(
    public events: Events,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public auth: AuthProvider,
    public storage: Storage
  ) {
    this.email = "email";

    try {
      firebase.initializeApp(firebaseConfig);
      this.user = firebase.auth().currentUser;
    } catch (error) {
      console.log(error)
    }

    platform.ready().then(() => {

      try {
        statusBar.styleDefault();
      } catch (error) {
        console.log(error)
      }

    });
    events.subscribe("user:created", (user, time) => {
      this.photoURL = user.photoURL;
      this.username = user.displayName;
      this.email = user.email;
    });
  }

  openPage(page: PageInterface) {
    // close the menu when clicking a link from the menu
    // navigate to the new page if it is not the current page
    if (page.title == "로그아웃") {
      // Give the menu time to close before changing to logged out
      this.auth.logoutUser();
    }
    this.nav.push(page.component);
  }

  profile() {
    this.nav.push("CharacterPage");
  }

  changeProfilePicture() {
    this.nav.push('CharacterPage');
  }

  logout() {
    if (this.user) {
      let alert = this.alertCtrl.create({
        title: "정말로 로그아웃 하시겠습니까?",
        buttons: [
          {
            text: "확인",
            handler: () => {
              // log out from firebase auth service and remove previous cache about user credential
              this.auth.logoutUser().then(() => {
                this.storage.remove("localcred").then(() => {
                  this.nav.push("LoginPage");
                });
              });
            }
          },
          {
            text: "취소",
            role: "cancel",
            handler: () => { }
          }
        ]
      });
      alert.present();
    } else {
      this.nav.push("LoginPage");
    }
  }

}

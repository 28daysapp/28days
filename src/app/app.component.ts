import { Component, ViewChild } from '@angular/core';
import { MenuController, AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { Push, PushObject, PushOptions } from '@ionic-native/push';
import firebase from 'firebase';
import { FirstRunPage } from '../pages';
import { FCM } from '@ionic-native/fcm';
import { AuthProvider } from '../providers/auth/auth';
import { Storage } from '@ionic/storage';


export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
};

// firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyBz5qFakcahaCIdkR1XbDemZEJc37-l7vs",
  authDomain: "days-fd14f.firebaseapp.com",
  databaseURL: "https://days-fd14f.firebaseio.com",
  projectId: "days-fd14f",
  storageBucket: "days-fd14f.appspot.com",
  messagingSenderId: "209011208541"
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  user;
  userprofile;
  username;
  // set entry page of app
  // rootPage:any = 'TabsPage';
  rootPage = FirstRunPage;

  pages: any[] = [
    { title: 'Community', component: 'CommunityPage' },
    { title: 'Supporter', component: 'SupporterPage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Home', component: 'HomePage' },
    { title: 'My Page', component: 'MypagePage' }
  ]
  appPages: PageInterface[] = [
    { title: '내가 쓴 글', component: 'MypostPage', icon: 'calendar' },
    //not yet made
    // { title: '충전소', name: 'TabsPage', component: TabsPage, tabComponent: HomePage, index: 0, icon: 'contacts' },
    { title: '보관함', component: 'MydepositoryPage', icon: 'map' },
    { title: '결제 내역', component: 'PaymentPage', icon: 'information-circle' }
  ];
  loggedInPages: PageInterface[] = [
    // { title: '푸쉬알람', name: 'TabsPage', component: TabsPage, tabComponent: HomePage, index: 0, icon: 'person' },
    { title: '비밀번호 바꾸기', component: 'PwdchangePage', icon: 'help' },
    { title: '로그아웃', component: 'TabsPage', icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: '로그인', component: 'LoginPage', icon: 'log-in' },
    { title: '회원가입', component: 'SignupPage', icon: 'person-add' }
  ];

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menu: MenuController,
    // public push: Push,
    public alertCtrl: AlertController,
    public fcm: FCM,
    // public userProvider: UserProvider,
    public auth: AuthProvider,
    public storage: Storage,
  ) {
    firebase.initializeApp(firebaseConfig);
    this.user = firebase.auth().currentUser;
    if (this.user) {
      this.menu.enable(true, 'loggedInMenu');
      this.menu.enable(false, 'loggedOutMenu');
    }
    else {
      this.menu.enable(true, 'loggedOutMenu');
      this.menu.enable(false, 'loggedInMenu');
    }
    platform.ready().then(() => {
    //   // Okay, so the platform is ready and our plugins are available.
    //   // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    //   // this.initPushNotification();

      if (this.platform.is('cordova') || this.platform.is('android') || this.platform.is('ios')) {
        //Notifications
        fcm.getToken().then(token => {
          console.log("Token: " + token);
        })
        fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {
            console.log("Received in background");
          } else {
            console.log("Received in foreground");
          };
        })
        fcm.onTokenRefresh().subscribe(token => {
          console.log(token);
        });
        //end notifications.
      }
    });
    // this.pleaselogin();
}

  openPage(page: PageInterface) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    if (page.title == '로그아웃') {
      // Give the menu time to close before changing to logged out
      this.auth.logoutUser();
    }
      this.nav.push(page.component);
    
  }

    // if (page.logsOut === true) {
    //   // Give the menu time to close before changing to logged out
    //   this.user.logout();
    // }



  // isActive(page: PageInterface) {
  //   let childNav = this.nav.getActiveChildNavs()[0];
  // }

  /*
    initPushNotification() {
      if (!this.platform.is('cordova')) {
        console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
        return;
      }
      const options: PushOptions = {
        android: {
          senderID: '209011208541'
        },
        ios: {
          alert: 'true',
          badge: false,
          sound: 'true'
        },
        windows: {}
      };
      const pushObject: PushObject = this.push.init(options);

      pushObject.on('registration').subscribe((data: any) => {
        console.log('device token -> ' + data.registrationId);
        //TODO - send device token to server
      });

      pushObject.on('notification').subscribe((data: any) => {
        console.log('message -> ' + data.message);
        // if user using app and push notification comes
        if (data.additionalData.foreground) {
          // if application open, show popup
          let confirmAlert = this.alertCtrl.create({
            title: 'New Notification',
            message: data.message,
            buttons: [{
              text: 'Ignore',
              role: 'cancel'
            }, {
              text: 'View',
              handler: () => {
                //TODO: Your logic here
                this.nav.push(HomePage, {message: data.message});
              }
            }]
          });
          confirmAlert.present();
        } else {
          // if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly
          this.nav.push(HomePage, { message: data.message });
          console.log('Push notification clicked');
        }
      });

      pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
    }
    */
}


import { Component } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { ViewChild } from '@angular/core';
import firebase from 'firebase';
import { FirstRunPage } from '../pages';
import { FCM } from '@ionic-native/fcm'


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
  // set entry page of app
  // rootPage:any = 'TabsPage';
  rootPage = FirstRunPage;

  pages: any[] = [
    { title: 'Community', component: 'CommunityPage' },
    { title: 'Supporter', component: 'SupporterPage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Gogohome', component: 'GogohomePage' },
    { title: 'Home', component: 'HomePage' },
    { title: 'My Page', component: 'MypagePage' }
  ]

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    // public push: Push,
    public alertCtrl: AlertController,
    public fcm: FCM
  ) {
    firebase.initializeApp(firebaseConfig);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // this.initPushNotification();

      if (this.platform.is('cordova')) {
        //Notifications
        fcm.subscribeToTopic('all');
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


      statusBar.styleDefault();
      splashScreen.hide();

    });
  }
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

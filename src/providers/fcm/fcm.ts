import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';
import { FCM } from '../../../node_modules/@ionic-native/fcm';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  firebaseMessaging = firebase.messaging();
  firebaseDatabase = firebase.database();
  firebaseAuth = firebase.auth();
  firebaseUsers = firebase.database().ref('/users');
  user;
  token;
  buddy;
  data;
  username;

  

  constructor(public alertCtrl: AlertController, public fcm: FCM, public http: Http) {
    console.log('Hello FcmProvider Provider');
  }


  handleTokenRefresh() {
    // return this.firebaseMessaging.getToken().then((token) => {
    //   const uid = this.firebaseAuth.currentUser.uid;
    //   this.firebaseDatabase.ref(`/tokens/${uid}`).update({
    //     token: token,
    //   })
    // })
  }

  getToken(user) {
    this.user = user;
    console.log("get token start");
    if (this.user) {
      console.log("token logged in")
      const uid = this.firebaseAuth.currentUser.uid;
      
      this.firebaseUsers.child(`${uid}`).once('value').then((snapshot) => {
        this.username = snapshot.val().username;
      });

      this.fcm.getToken().then(token => {
        this.token = token;
        console.log("HomePage Token: " + token);
        this.firebaseDatabase.ref(`/tokens/${uid}`).set({
          token: this.token,
          username: this.username
        });
        var promise = new Promise((resolve) => {
          this.firebaseUsers.child(uid).update({
            token: this.token
          });
          resolve(true);
        });


        return promise;
      })
    }
    console.log("get token end");
  }

  deleteToken(user) {
    this.user = user;
    console.log("delete token start");
    if (this.user) {
      console.log("token logged in")
      var uid = this.firebaseAuth.currentUser.uid;
      this.firebaseDatabase.ref(`/tokens/${uid}`).remove();
      var promise = new Promise((resolve) => {
        this.firebaseUsers.child(`${uid}/token`).remove();
        resolve(true);
      });
      return promise;
    }
    console.log("delete token end");
  }

  storeBuddyToken(buddy) {
    // if(buddy.token) {
    //   this.firebaseDatabase.ref(`buddy`).child(buddy.uid).set({
    //     buddy: buddy.username,
    //     token: buddy.token
    //   })
    // }
  }

  storeBothTokens(buddy) {

    // var uid = firebase.auth().currentUser.uid;
    // const senderToken = this.fcm.getToken();

    // if(buddy.token) {
    //   this.firebaseDatabase.ref(`chats/${uid}/tokens`).set({
    //     tokens: [buddy.token, senderToken]
    //   })
    // }
  }

  sendNotification() {
  //   this.http.get('https://us-central1-days-fd14f.cloudfunctions.net/notifyChat')
  //     .subscribe(data => {
  //       console.log('sendNotification request Data: ', data);
  //     })
  //   console.log("nothing done here")
  }
}

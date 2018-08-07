import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';
import { FCM } from '../../../node_modules/@ionic-native/fcm';

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

  constructor(public alertCtrl: AlertController, public fcm: FCM) {
    console.log('Hello FcmProvider Provider');
  }


  handleTokenRefresh() {
    return this.firebaseMessaging.getToken().then((token) => {
      this.firebaseDatabase.ref('/tokens').push({
        token: token,
        uid: this.firebaseAuth.currentUser.uid
      })
    })
  }

  getToken(user) {
    this.user = user;
    console.log("get token start");
    if (this.user) {
      console.log("token logged in")
      var uid = firebase.auth().currentUser.uid;
      this.fcm.getToken().then(token => {
        console.log("HomePage Token: " + token);
        this.token = token;
        this.firebaseDatabase.ref('/tokens').push({
          token: token,
          uid: uid
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
      var uid = firebase.auth().currentUser.uid;
      this.fcm.getToken().then(token => {
        this.token = token;
      });
      var promise = new Promise((resolve) => {
        this.firebaseUsers.child(`${uid}/token`).remove();
        this.firebaseDatabase.ref(`tokens/`)
        resolve(true);
      });
      return promise;
    }
    console.log("delete token end");
  }
}

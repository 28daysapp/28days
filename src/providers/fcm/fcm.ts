import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';
import { FCM } from '../../../node_modules/@ionic-native/fcm';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'
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
  checkToken(uid) {
    var promise = new Promise((resolve) => {
      let hasToken;
      this.firebaseDatabase.ref(`/tokens/${uid}`).once('value').then((snapshot)=> {
        hasToken = snapshot.hasChild('token');
      });
      resolve(hasToken);
    });
    return promise
  }
  handleTokenRefresh() {
    this.firebaseMessaging.getToken().then((token) => {
      const uid = this.firebaseAuth.currentUser.uid;
      this.firebaseDatabase.ref(`/tokens/${uid}`).update({
        token: token,
      })
      var promise = new Promise((resolve) => {
        this.firebaseUsers.child(uid).update({
          token: token
        });
        resolve(true);
      });
      return promise;
    })
  }
  setToken(user) {
    this.user = user;
    if (this.user) {
      const uid = this.firebaseAuth.currentUser.uid;
      
      this.fcm.getToken().then(token => {
        this.token = token;
        console.log("HomePage Token: " + token);
        var promise = new Promise((resolve) => {
          this.firebaseUsers.child(uid).update({
            token: this.token
          });
          resolve(true);
        });
        return promise;
      })
    }
  }
  deleteToken(user) {
    this.user = user;
    if (this.user) {
      var uid = this.firebaseAuth.currentUser.uid;
      this.firebaseDatabase.ref(`/tokens/${uid}`).remove();
      var promise = new Promise((resolve) => {
        this.firebaseUsers.child(`${uid}/token`).remove();
        resolve(true);
      });
      return promise;
    }
  }
}
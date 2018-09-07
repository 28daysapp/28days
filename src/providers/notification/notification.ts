import firebase from 'firebase';
import { Injectable } from '@angular/core';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {

  fireNotification = firebase.database().ref('/notification');

  constructor() {
    console.log('Hello NotificationProvider Provider');
  }
  getAllNotification(uid) {
    var promise = new Promise((resolve) => {
      var notifications = [];
      this.fireNotification.child(uid).orderByChild('timestamp').once("value").then((snapshot) => { // firemypost에서 시간 순으로 가져오고 snapshot에 하나씩 가져옴
        snapshot.forEach((childSnapshot) => {
          var notification = childSnapshot.val();
          notifications.push(notification);
          notifications.reverse();
          resolve(notifications);
        });
      });
    });
    return promise;
  }
}

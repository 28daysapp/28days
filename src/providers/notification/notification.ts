import firebase, { database } from 'firebase';
import { Injectable } from '@angular/core';
import { resolve } from 'path';

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


  /*

  type : {
    readerUid: 대상자 Uid
    postId: 게시물 고유 아이디
    notificationType: 게시물, 댓글
    creatorUid: 알림 발생하는 사람 Uid
    timeCreated: 이벤트가 발생한 시간

  }

  */
  createNotification(type) {
    return new Promise((res, rej) => {
      let newNotificationRef = firebase.database().ref(`/notification/${type.readerUid}`).push();
      newNotificationRef.set({
        ...type,
        creatorUid: firebase.auth().currentUser.uid,
        creatorUsername: firebase.auth().currentUser.displayName,
        timeCreated: firebase.database.ServerValue.TIMESTAMP
      })
    });
  }

  readNotifications() {
    return new Promise((res) => {
      // let readerUid = firebase.auth().currentUser.uid;
      let readerUid = "12345";
      const notifications = [];
      firebase.database().ref(`/notification/${readerUid}`).orderByChild('timeCreated').once('value').then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const notification = childSnapshot.val();

          /*
          * Creator 고유 id로 profile-picture, displayName 들고오기
          */


          notifications.push(notification)
          notifications.reverse();
        })

        res(notifications);
      });
    });
  }

  // readNotifications(uid) {
  //   var promise = new Promise((resolve) => {
  //     var notifications = [];
  //     this.fireNotification.child(uid).orderByChild('timestamp').once("value").then((snapshot) => { // firemypost에서 시간 순으로 가져오고 snapshot에 하나씩 가져옴
  //       snapshot.forEach((childSnapshot) => {
  //         var notification = childSnapshot.val();
  //         notifications.push(notification);
  //         notifications.reverse();
  //         resolve(notifications);
  //       });
  //     });
  //   });
  //   return promise;
  // }

}

import firebase, { database } from 'firebase';
import { Injectable } from '@angular/core';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {

  constructor() {
    console.log('Hello NotificationProvider Provider');
  }
  /* 
  * ------------------ Creating Notification ------------------ 
  * Creator : 알림을 생성/발생하는 자
  * Reader: 알림을 읽는 사람

  <Input Type> : {
    readerType (게시물, 댓글, 채팅) : {
      type: 게시물, 댓글, 채팅
      uid: 고유 아이디 (알림을 눌렀을때 그 페이지로 갈 수 있기 위해 필요)
    }
    creatorType: 댓굴, 좋아요, 채팅
    readerUid: Reader Uid
  }
  */



  createNotification(type) {
    return new Promise((res, rej) => {
      let newNotificationRef = firebase.database().ref(`/notification/${type.readerUid}`).push();
      newNotificationRef.set({
        ...type,
        creatorUid: firebase.auth().currentUser.uid,
        timeCreated: firebase.database.ServerValue.TIMESTAMP
      })
    });
  }

  readCreatorData(uid) {
    return new Promise((resolve) => {
      firebase.database().ref(`/users/${uid}`).once('value').then((snapshot) => {
        const { photoURL, username } = snapshot.val();
        let result = {photoURL, username};
        resolve(result);
      })
    })
  }

  readNotifications() {
    return new Promise((resolve) => {
      let readerUid = firebase.auth().currentUser.uid;
      const notifications = [];
      const creatorUids = [];
      
      firebase.database().ref(`/notification/${readerUid}`).orderByChild('timeCreated').once('value').then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          notifications.push(childSnapshot.val());
          notifications.reverse();
        })
        for (let i = 0; i < notifications.length; i++) {
          creatorUids.push(notifications[i].creatorUid);
        }
        return creatorUids
      })
      .then((response) => {
        // Getting Creator's Current Photo and Username
        for (let i = 0; i < response.length; i++) {
          this.readCreatorData(response[i]).then((response) => {
            notifications[i].creatorPhoto = response['photoURL'];
            notifications[i].creatorUsername = response['username'];
          })
        }
        resolve(notifications);
      })
    });
  }

  deleteAllNotifications() {
    return new Promise((resolve, reject) => {
      let readerUid = firebase.auth().currentUser.uid;
      firebase.database().ref(`/notification/${readerUid}`).remove().then(() => {
        resolve(true);
      });
    });  
  }

}



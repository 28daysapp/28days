import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationProvider } from '../../providers/notification/notification';

/**
 * Generated class for the UserNotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-notification',
  templateUrl: 'user-notification.html',
})
export class UserNotificationPage {

  notifications = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public notification: NotificationProvider
  ) {}

/* ------------------------------------------------------------------ */


  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {
    let type = {
      readerType: {
        type: '채팅',
        uid: '게시물-고유-ID'
      },
      creatorType: "채팅",
      readerUid: "12345"
    }

    this.notification.createNotification(type);

    console.log('ionViewDidLoad UserNotificationPage');
    this.getNotificationList();
  }

/* ------------------------------------------------------------------ */
  getNotificationList() {
    this.notification.readNotifications().then((response:any) => {
      console.log(response);
      this.notifications = response;
    })
  }

  clearNotificationList() {
    this.notification.deleteAllNotifications().then((response) => {
      if (response === true) {
        this.notifications = [];
        console.log("Deleted All Notifications")
      } else {
        console.log("Error in Deleting Notifications")
      }
    })
  }

/*

! 채팅 신청
? {{creator}}님이 {{reader}}님과 {{reader-type}}을 시작했습니다!

! Notification-Reader 게시물에 Notification-Creator가  댓글을 남김
? {{creator}}님이 {{reader}} 님의 {{reader-type}}에 {{creator-type}} 를/을 남겼습니다!

!Notification-Reader 게시물에 Notification-Creator가  좋아요를 남김
?{{creator}}님이 {{reader}} 님의 {{reader-type}}에 {{creator-type}} 를/을 남겼습니다!

*/

}

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

  notifications

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public notification: NotificationProvider
  ) {}

/* ------------------------------------------------------------------ */

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserNotificationPage');
  }

  ionViewWillEnter() {
    
    /*
  ?  let type = {
  ?    readerUid: 수신자 고유번호
  ?    readerUsername: 수진자 Display Name
  ?    readerType: 수신자 Notification 대한 정보
  ?      {type: 게시물, typeId: 게시물-고유ID, notifier: "좋아요" or "댓글"}
  ?      {type: 채팅, typeID: 채팅-고유ID}

  ?    creatorUid: 알림 발생하는 사람 고유번호
  ?    creatorUsername: "알림 발생하는 사람 이름"
  ?    timeCreated: 알림 발생 시각
  ?  };
    */

    // this.notification.createNotification(type);
    this.getNotificationList();
  }

/* ------------------------------------------------------------------ */

  getNotificationList() {
    this.notification.readNotifications().then((res) => {
      console.log(res);
    });
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

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import  firebase  from 'firebase';
import { NotificationProvider } from '../../providers/notification/notification';
/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  uid;
  notifications;
  constructor(public navCtrl: NavController, public navParams: NavParams, public notification: NotificationProvider) {
    this.uid = firebase.auth().currentUser.uid;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  ionViewWillEnter(){
    var promise = new Promise((resolve) => {
      this.notification.getAllNotification(this.uid).then((notifications) => {
        this.notifications = notifications;
        console.log('SupporterPage - getallusersExceptbuddy - userprofiles : ' + JSON.stringify(this.notifications));
      }).then(() => {
      });
    });
    return promise;
  }

}

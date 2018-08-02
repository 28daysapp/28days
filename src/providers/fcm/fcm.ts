import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';
import { FCM } from '../../../node_modules/@ionic-native/fcm';
// import { HTTP } from '@ionic-native/http';
import { HttpClient } from '@angular/common/http/';
import { HttpHeaders } from '@angular/common/http';


/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  fireusers = firebase.database().ref('/users');
  user;
  token;
  buddy;
  data;

  constructor(public alertCtrl: AlertController, public http: HttpClient, public fcm: FCM) {
    console.log('Hello FcmProvider Provider');
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'TOKEN',
      subTitle: this.token,
      buttons: ['OK']
    });
    alert.present();
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
        var promise = new Promise((resolve) => {
          this.fireusers.child(uid).update({
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
        this.fireusers.child(`${uid}/token`).remove();
        resolve(true);
      });
      return promise;
    }
    console.log("delete token end");
  }

  sendFcm(buddy) {
    let target: "cVaag5YeCTc:APA91bGYLJ5hGrXuKnwtkIV4MOv-Ko8D4zTXDaLfTWXxxkhHyx_fiK4yAEVJn0nuuQaX5-1eaqJnlfsWz0bZOqsd0B06WmCHRuuIdZUP3BWtKTw7-BsnTIneP-eNekoL9n_TpFjGwGCQcVbiueM0ji7uCg-YIYN68A";


    let body = {
      "to":target,
      data: {
        "score" : "33333"
      }
    }
    let options = new HttpHeaders().set('Content-Type','application/json');
    this.http.post("https://fcm.googleapis.com/fcm/send",body,{
      headers: options.set('Authorization', 'key=AIzaSyDoF6-MjWsZab7VWwfD-rwdX59jXMyLSeM'),
    })
      .subscribe();





    this.buddy = buddy;
    console.log("WHO IS THIS BUDDY?!: " + this.buddy.username);
    console.log("Buddy Token: " + this.buddy.token);
    // this.showAlert();

    // let url = "https://fcm.googleapis.com/fcm/send";

    // this.http.post(url, {
    //   "to" : "cVaag5YeCTc:APA91bGYLJ5hGrXuKnwtkIV4MOv-Ko8D4zTXDaLfTWXxxkhHyx_fiK4yAEVJn0nuuQaX5-1eaqJnlfsWz0bZOqsd0B06WmCHRuuIdZUP3BWtKTw7-BsnTIneP-eNekoL9n_TpFjGwGCQcVbiueM0ji7uCg-YIYN68A",
    //   "notification" : {
    //       "body" : "KYAA@!!!!!",
    //       "title": "KAWAIIIIII"
    //   }
    // }, {
    //   'Authorization': 'key=AIzaSyDoF6-MjWsZab7VWwfD-rwdX59jXMyLSeM',
    //   'Content-Type': 'application/json'
    // })
    // .then(data => {
    //   console.log(data.status);
    //   console.log(data.data); // data received by server
    //   console.log(data.headers);
    // })
    // .catch(error => {
    //   console.log(error.status);
    //   console.log(error.error); // error message as string
    //   console.log(error.headers);
    // });

    if (this.buddy.token) {

      let body = {
        "to":target,
        data: {
          "score" : "33333"
        }
      }
      let options = new HttpHeaders().set('Content-Type','application/json');
      this.http.post("https://fcm.googleapis.com/fcm/send",body,{
        headers: options.set('Authorization', 'key=AIzaSyDoF6-MjWsZab7VWwfD-rwdX59jXMyLSeM'),
      })
        .subscribe();

      // let url = "https://fcm.googleapis.com/fcm/send";
      // this.http.post(url, {
      //   "to" : "cVaag5YeCTc:APA91bGYLJ5hGrXuKnwtkIV4MOv-Ko8D4zTXDaLfTWXxxkhHyx_fiK4yAEVJn0nuuQaX5-1eaqJnlfsWz0bZOqsd0B06WmCHRuuIdZUP3BWtKTw7-BsnTIneP-eNekoL9n_TpFjGwGCQcVbiueM0ji7uCg-YIYN68A",
      //   "notification" : {
      //       "body" : "KYAA@!!!!!",
      //       "title": "KAWAIIIIII"
      //   }
      // }, {
      //   'Authorization': 'key=AIzaSyDoF6-MjWsZab7VWwfD-rwdX59jXMyLSeM',
      //   'Content-Type': 'application/json'
      // })
      // .then(data => {
      //   console.log(data.status);
      //   console.log(data.data); // data received by server
      //   console.log(data.headers);
      // })
      // .catch(error => {
      //   console.log(error.status);
      //   console.log(error.error); // error message as string
      //   console.log(error.headers);
      // });


      // return new Promise((resolve, reject) => {
      //   let data = {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'key=AIzaSyDoF6-MjWsZab7VWwfD-rwdX59jXMyLSeM',
      //     'Body': {
      //       "to" : "f7lVCgPIOWU:APA91bEmKWuD6Daa7pPahpXdOGZ_RoMaYwRaDAHLucsA3uPBL5j1kS3IylsY6ZU4E9mcaS4P5mebit9KMGcuLt8bUu8qRpGH_CdilYsYbKjtnH6ryGG7zYfnNxIqbxRf0AV_B1ab6WAt9uep6-bk1m9ko297IrnMyQ",
      //       "collapse_key" : "type_a",
      //       "notification" : {
      //           "body" : "First Notification",
      //           "title": "Collapsing A"
      //       },
      //       "data" : {
      //           "body" : "First Notification",
      //           "title": "Collapsing A",
      //           "key_1" : "Data for key one",
      //           "key_2" : "Hellowww"
      //       }
      //      }
      //   };
      //   this.http.post(this.url, JSON.stringify(data))
      //     .subscribe(res => {
      //       resolve(res);
      //     }, (err) => {
      //       reject(err);
      //     });
      // });
    }
  }
}

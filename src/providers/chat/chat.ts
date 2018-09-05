import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {
  firechat = firebase.database().ref('/chats');
  fireusers = firebase.database().ref('/users');
  buddy;
  buddyId;
  // buddyToken;
  // senderToken;
  chatmessages;
  count;

  constructor(public user: UserProvider, public events: Events) {
  }

  getallusersExceptbuddy() {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      this.firechat.child(uid).once("value").then((snapshot) => {
        var buddies = [];
        snapshot.forEach((childSnapshot) => {
          buddies.push(childSnapshot.key);
        });
        this.user.getallUserprofiles().then((res) => {
          var users = [];
          for (var i in res) {
            if (res[i].uid != uid && buddies.indexOf(res[i].uid) == -1) {
              users.push(res[i]);
            }
          }
          resolve(users);
        });
      });
    });
    return promise;
  }

  initializebuddy(buddy) {
    this.buddy = buddy;
    this.buddyId = this.buddy.uid;
    console.log("버디야!!: " + JSON.stringify(this.buddy));
    // this.storeTokens();
  }

  // storeTokens() {
  //   var uid = firebase.auth().currentUser.uid;

  //   this.fireusers.child(this.buddyId).once('value').then((snapshot) => {
  //     this.buddyToken = snapshot.token;
  //   })

  //   this.fireusers.child(uid).once('value').then((snapshot) => {
  //     this.senderToken = snapshot.token;
  //   }).then(() => this.firechat.child(`${uid}/${this.buddy.uid}/messages`).set({
  //     buddyToken: this.buddyToken,
  //     senderToken: this.senderToken
  //   }));
  // }

  sendMessage(msg) {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      this.firechat.child(`${uid}/${this.buddy.uid}`).once("value").then((snapshot) => {
        if (snapshot.val()) {

          this.countUnseenMessages(uid);
          
          this.firechat.child(`${uid}/${this.buddy.uid}`).update({
            recentmessage: msg,
            recenttimestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => this.firechat.child(`${this.buddy.uid}/${uid}`).update({
            recentmessage: msg,
            recenttimestamp: firebase.database.ServerValue.TIMESTAMP,
            count: this.count
          })).then(() => this.firechat.child(`${uid}/${this.buddy.uid}/messages`).push().set({
            message: msg,
            sentby: uid,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          })).then(() => this.firechat.child(`${this.buddy.uid}/${uid}/messages`).push().set({
            message: msg,
            sentby: uid,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          })).then(() => {
            resolve(true);
          });

        } else {

          console.log('create new chat');
          this.firechat.child(`${uid}/${this.buddy.uid}`).set({
            requester: uid,
            buddyuid: this.buddy.uid,
            recentmessage: msg,
            recenttimestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            this.firechat.child(`${this.buddy.uid}/${uid}`).set({
              requester: uid,
              buddyuid: this.buddy.uid,
              recentmessage: msg,
              recenttimestamp: firebase.database.ServerValue.TIMESTAMP,
              count: 1
            }).then(() => {
              this.firechat.child(`${uid}/${this.buddy.uid}/messages`).push().set({
                message: msg,
                sentby: uid,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              }).then(() => this.firechat.child(`${this.buddy.uid}/${uid}/messages`).push().set({
                message: msg,
                sentby: uid,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              })).then(() => {
                resolve(true);
              });
            });
          });

        }
      });
    });
    return promise;
  }

  // Updates unseen message counts
  countUnseenMessages(uid) {
    this.firechat.child(`${this.buddy.uid}/${uid}`).once("value").then((snapshot) => {
      if (snapshot.val()) {
        const data = snapshot.val();
        this.count = parseInt(data.count, 10) + 1;
      } 
    });
  }

  // Checks for empty count values in chat database
  checkZeroCount() {
    // const uid = firebase.auth().currentUser.uid;
    // this.firechat.child(`${this.buddy.uid}/${uid}`).once("value").then((snapshot) => {
    //   if (!snapshot.val().count) {
    //     this.firechat.child(`${this.buddy.uid}/${uid}`).update({
    //       count: 0
    //     });
    //   }
    // });
  }

  getAllMessages() {
    var uid = firebase.auth().currentUser.uid;
    this.firechat.child(`${uid}/${this.buddy.uid}/messages`).on('value', (snapshot) => {
      this.chatmessages = [];
      for (var i in snapshot.val()) {
        this.chatmessages.push(snapshot.val()[i]);
      }
      this.setshowprofileimageprop();
      this.events.publish('newmessage');
    });
  }

  stoplistenmessages() {
    var uid = firebase.auth().currentUser.uid;
    this.firechat.child(`${uid}/${this.buddy.uid}/messages`).off();
  }

  setshowprofileimageprop() {
    var showimage = true;
    for (var i in this.chatmessages) {
      if (this.chatmessages[i].sentby == this.buddy.uid) {
        if (showimage) {
          this.chatmessages[i].showprofileimage = true;
          showimage = false;
        }
      } else {
        showimage = true;
      }
    }
  }

  getAllRequestInfos() {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      this.firechat.child(uid).once("value").then((snapshot) => {
        var requestchatuids = [];
        var requestchats = [];
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().requester == uid) {
            requestchatuids.push(childSnapshot.val().buddyuid);
            requestchats.push(childSnapshot.val());
          }
        });
        this.fireusers.once("value").then((userprofile) => {
          userprofile.forEach((childSnapshot) => {
            var index = requestchatuids.indexOf(childSnapshot.val().uid);
            if (index != -1) {
              requestchats[index].buddyusername = childSnapshot.val().username;
              requestchats[index].buddyphotoURL = childSnapshot.val().photoURL;
            }
          });
          resolve(requestchats);
        });
      });
    });
    return promise;
  }

  deleteChat(buddyuid) {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      this.firechat.child(`${uid}/${buddyuid}`).remove().then(() => {
        resolve(true);
      });
    });
    return promise;
  }

  getAllRequestedInfos() {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      this.firechat.child(uid).once("value").then((snapshot) => {
        var requestedchatuids = [];
        var requestedchats = [];
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().requester != uid) {
            console.log("key? : " + Object.keys(snapshot.val())[0]);
            console.log("44444444444444444---------------------- : " + JSON.stringify(childSnapshot.val()));

            requestedchatuids.push(Object.keys(snapshot.val())[0]);
            requestedchats.push(childSnapshot.val());
          }
        });
        this.fireusers.once("value").then((userprofile) => {
          userprofile.forEach((childSnapshot) => {
            console.log("33333333333333333---------------------- : " + JSON.stringify(childSnapshot.val()));
            var index = requestedchatuids.indexOf(childSnapshot.val().uid);
            if (index != -1) {
              requestedchats[index].buddyusername = childSnapshot.val().username;
              requestedchats[index].buddyphotoURL = childSnapshot.val().photoURL;
            }
          });
          resolve(requestedchats);
        });
      });
    });
    return promise;
  }

  checkstart() {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      this.firechat.child(`${uid}/${this.buddy.uid}`).once("value").then((snapshot) => {
        if (snapshot.val()) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
    return promise;
  }

}

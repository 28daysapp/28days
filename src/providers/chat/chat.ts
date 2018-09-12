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
  buddyToken;
  requesterToken;
  targetToken;
  chatmessages;
  count;
  requester: string;
  photoURL: string;
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
    this.buddyToken = this.buddy.token;
    console.info(" WHAT ABOUIT THIS BUDDY: " + JSON.stringify(this.buddy));
  }
  sendMessage(msg) {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      this.firechat.child(`${uid}/${this.buddy.uid}`).once("value").then((snapshot) => {
        if (snapshot.val()) {
          this.countUnseenMessages(uid);
          this.targetToken = this.buddy.token;
          // this.fireusers.child(`${uid}`).once('value').then((snapshot) => { 
          //   const user = snapshot.val();
          //   this.targetToken = user.token;
          // })
            this.firechat.child(`${uid}/${this.buddy.uid}`).update({
              recentmessage: msg,
              recenttimestamp: firebase.database.ServerValue.TIMESTAMP,
              targetToken: this.targetToken
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
          this.fireusers.child(`${uid}`).once('value').then((snapshot) => {
            const user = snapshot.val();
            this.requester = user.username;
            this.photoURL = user.photoURL;
            this.requesterToken = user.token;
            this.targetToken = user.token;
          }).then(() => {
            console.log('create new chat');
            this.firechat.child(`${uid}/${this.buddy.uid}`).set({
              requester: uid,
              requesterUsername: this.requester,
              requesterPhoto: this.photoURL,
              buddyUsername: this.buddy.username,
              buddyuid: this.buddy.uid,
              buddyPhoto: this.buddy.photoURL,
              recentmessage: msg,
              recenttimestamp: firebase.database.ServerValue.TIMESTAMP,
              count: 0,
              buddyToken: this.buddyToken,
              requesterToken: this.requesterToken,
              targetToken: ""
            }).then(() => {
              this.firechat.child(`${this.buddy.uid}/${uid}`).set({
                requester: uid,
                requesterUsername: this.requester,
                requesterPhoto: this.photoURL,
                buddyuid: this.buddy.uid,
                buddyUsername: this.buddy.username,
                buddyPhoto: this.buddy.photoURL,
                recentmessage: msg,
                recenttimestamp: firebase.database.ServerValue.TIMESTAMP,
                count: 1,
                buddyToken: this.buddyToken,
                requesterToken: this.requesterToken,
                targetToken: this.targetToken
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
          })
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
  clearCount(buddy) {
    const uid = firebase.auth().currentUser.uid;
    this.firechat.child(`${uid}/${buddy.uid}`).once('value').then((snapshot) => {
      if (snapshot.hasChild('count')) {
        this.firechat.child(`${uid}/${buddy.uid}`).update({
          count: 0
        });
      }
    })
  }
  // Checks for empty count values in chat database
  checkZeroCount() {
    const uid = firebase.auth().currentUser.uid;
    this.firechat.child(`${this.buddy.uid}/${uid}`).once("value").then((snapshot) => {
      if (!snapshot.hasChild('count')) {
        this.firechat.child(`${this.buddy.uid}/${uid}`).set({
          count: 0
        });
      }
    });
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
        console.log("this snapshot!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1: " + JSON.stringify(snapshot));
        var requestedchatuids = [];
        var requestedchats = [];
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().requester != uid) {
            requestedchats.push(childSnapshot.val());
          }
        })
        resolve(requestedchats);
      })
    });
    return promise;
    // var promise = new Promise((resolve) => {
    //   this.firechat.child(uid).once("value").then((snapshot) => {
    //     var requestedchatuids = [];
    //     var requestedchats = [];
    //     snapshot.forEach((childSnapshot) => {
    //       if (childSnapshot.val().requester != uid) {
    //         requestedchatuids.push(Object.keys(snapshot.val())[0]);
    //         requestedchats.push(childSnapshot.val());
    //       }
    //     });
    //     this.fireusers.once("value").then((userprofile) => {
    //       userprofile.forEach((childSnapshot) => {
    //         var index = requestedchatuids.indexOf(childSnapshot.val().uid);
    //         if (index != -1) {
    //           requestedchats[index].buddyusername = childSnapshot.val().username;
    //           requestedchats[index].buddyphotoURL = childSnapshot.val().photoURL;
    //         }
    //       });
    //       resolve(requestedchats);
    //     });
    //   });
    // });
    // return promise;
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

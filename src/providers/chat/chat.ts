import { Injectable } from "@angular/core";
import { Events } from "ionic-angular";

import { UserProvider } from "../../providers/user/user";

import firebase from "firebase";

@Injectable()
export class ChatProvider {
  firechat = firebase.database().ref("/chats");
  fireusers = firebase.database().ref("/users");
  buddy;
  buddyId;
  buddyToken;
  requesterToken;
  targetToken;
  chatmessages;
  count;
  requester: string;
  photoURL: string;
  constructor(public user: UserProvider, public events: Events) {}
  getallusersExceptbuddy() {
    const uid = firebase.auth().currentUser.uid;
    const promise = new Promise(resolve => {
      this.firechat
        .child(uid)
        .once("value")
        .then(snapshot => {
          const buddies = [];
          snapshot.forEach(childSnapshot => {
            buddies.push(childSnapshot.key);
          });
          this.user.getallUserprofiles().then(res => {
            const users = [];
            for (const i in res) {
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
  }
  sendMessage(msg) {
    const uid = firebase.auth().currentUser.uid;
    const promise = new Promise(resolve => {
      this.firechat
        .child(`${uid}/${this.buddy.uid}`)
        .once("value")
        .then(snapshot => {
          if (snapshot.val()) {
            this.countUnseenMessages(uid);
            this.targetToken = this.buddy.token;
            // this.fireusers.child(`${uid}`).once('value').then((snapshot) => {
            //   const user = snapshot.val();
            //   this.targetToken = user.token;
            // })
            this.firechat
              .child(`${uid}/${this.buddy.uid}`)
              .update({
                recentmessage: msg,
                recenttimestamp: firebase.database.ServerValue.TIMESTAMP,
                targetToken: this.targetToken
              })
              .then(() =>
                this.firechat.child(`${this.buddy.uid}/${uid}`).update({
                  recentmessage: msg,
                  recenttimestamp: firebase.database.ServerValue.TIMESTAMP,
                  count: this.count
                })
              )
              .then(() =>
                this.firechat
                  .child(`${uid}/${this.buddy.uid}/messages`)
                  .push()
                  .set({
                    message: msg,
                    sentby: uid,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                  })
              )
              .then(() =>
                this.firechat
                  .child(`${this.buddy.uid}/${uid}/messages`)
                  .push()
                  .set({
                    message: msg,
                    sentby: uid,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                  })
              )
              .then(() => {
                resolve(true);
              });
          } else {
            this.fireusers
              .child(`${uid}`)
              .once("value")
              .then(snapshot => {
                const user = snapshot.val();
                this.requester = user.username;
                this.photoURL = user.photoURL;
                this.requesterToken = user.token;
                this.targetToken = user.token;
              })
              .then(() => {
                this.firechat
                  .child(`${uid}/${this.buddy.uid}`)
                  .set({
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
                  })
                  .then(() => {
                    this.firechat
                      .child(`${this.buddy.uid}/${uid}`)
                      .set({
                        requester: uid,
                        requesterUsername: this.requester,
                        requesterPhoto: this.photoURL,
                        buddyuid: this.buddy.uid,
                        buddyUsername: this.buddy.username,
                        buddyPhoto: this.buddy.photoURL,
                        recentmessage: msg,
                        recenttimestamp:
                          firebase.database.ServerValue.TIMESTAMP,
                        count: 1,
                        buddyToken: this.buddyToken,
                        requesterToken: this.requesterToken,
                        targetToken: this.targetToken
                      })
                      .then(() => {
                        this.firechat
                          .child(`${uid}/${this.buddy.uid}/messages`)
                          .push()
                          .set({
                            message: msg,
                            sentby: uid,
                            timestamp: firebase.database.ServerValue.TIMESTAMP
                          })
                          .then(() =>
                            this.firechat
                              .child(`${this.buddy.uid}/${uid}/messages`)
                              .push()
                              .set({
                                message: msg,
                                sentby: uid,
                                timestamp:
                                  firebase.database.ServerValue.TIMESTAMP
                              })
                          )
                          .then(() => {
                            resolve(true);
                          });
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
    this.firechat
      .child(`${this.buddy.uid}/${uid}`)
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          const data = snapshot.val();
          this.count = parseInt(data.count, 10) + 1;
        }
      });
  }
  clearCount(buddy) {
    const uid = firebase.auth().currentUser.uid;
    this.firechat
      .child(`${uid}/${buddy.uid}`)
      .once("value")
      .then(snapshot => {
        if (snapshot.hasChild("count")) {
          this.firechat.child(`${uid}/${buddy.uid}`).update({
            count: 0
          });
        }
      });
  }
  // Checks for empty count values in chat database
  checkZeroCount() {
    const uid = firebase.auth().currentUser.uid;
    this.firechat
      .child(`${this.buddy.uid}/${uid}`)
      .once("value")
      .then(snapshot => {
        if (!snapshot.hasChild("count")) {
          this.firechat.child(`${this.buddy.uid}/${uid}`).set({
            count: 0
          });
        }
      });
  }
  getAllMessages() {
    const uid = firebase.auth().currentUser.uid;
    this.firechat
      .child(`${uid}/${this.buddy.uid}/messages`)
      .on("value", snapshot => {
        this.chatmessages = [];
        for (const i in snapshot.val()) {
          this.chatmessages.push(snapshot.val()[i]);
        }
        this.setshowprofileimageprop();
        this.events.publish("newmessage");
      });
  }
  stoplistenmessages() {
    const uid = firebase.auth().currentUser.uid;
    this.firechat.child(`${uid}/${this.buddy.uid}/messages`).off();
  }
  setshowprofileimageprop() {
    let showimage = true;
    for (const i in this.chatmessages) {
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
    const uid = firebase.auth().currentUser.uid;
    const promise = new Promise(resolve => {
      this.firechat
        .child(uid)
        .once("value")
        .then(snapshot => {
          const requestchatuids = [];
          const requestchats = [];
          snapshot.forEach(childSnapshot => {
            if (childSnapshot.val().requester == uid) {
              requestchatuids.push(childSnapshot.val().buddyuid);
              requestchats.push(childSnapshot.val());
            }
          });
          this.fireusers.once("value").then(userprofile => {
            userprofile.forEach(childSnapshot => {
              const index = requestchatuids.indexOf(childSnapshot.val().uid);
              if (index != -1) {
                requestchats[
                  index
                ].buddyusername = childSnapshot.val().username;
                requestchats[
                  index
                ].buddyphotoURL = childSnapshot.val().photoURL;
              }
            });
            resolve(requestchats);
          });
        });
    });
    return promise;
  }
  deleteChat(buddyuid) {
    const uid = firebase.auth().currentUser.uid;
    const promise = new Promise(resolve => {
      this.firechat
        .child(`${uid}/${buddyuid}`)
        .remove()
        .then(() => {
          resolve(true);
        });
    });
    return promise;
  }
  getAllRequestedInfos() {
    const uid = firebase.auth().currentUser.uid;
    const promise = new Promise(resolve => {
      this.firechat
        .child(uid)
        .once("value")
        .then(snapshot => {
          const requestedchats = [];
          snapshot.forEach(childSnapshot => {
            if (childSnapshot.val().requester != uid) {
              requestedchats.push(childSnapshot.val());
            }
          });
          resolve(requestedchats);
        });
    });
    return promise;
  }
  checkstart() {
    const uid = firebase.auth().currentUser.uid;
    const promise = new Promise(resolve => {
      this.firechat
        .child(`${uid}/${this.buddy.uid}`)
        .once("value")
        .then(snapshot => {
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

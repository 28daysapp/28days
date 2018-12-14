import { Injectable } from "@angular/core";
import firebase from "firebase";

@Injectable()
export class UserProvider {
  fireusers = firebase.database().ref("/users");
  fireusernames = firebase.database().ref("/usernames");
  photo;

  constructor() {}

  readJoinedCommunities(uid) {
    const promise = new Promise(resolve => {
      const communities = [];
      firebase
        .database()
        .ref(`/users/${uid}`)
        .child("joinedCommunities")
        .once("value")
        .then(snapshot => {
          snapshot.forEach(childSnapshot => {
            let community = {
              communityName: childSnapshot.val().communityName,
              joinedTime: childSnapshot.val().joinedTime
            };
            communities.push(community);
          });
          resolve(communities);
        });
    });
    return promise;
  }

  readCurrentUser() {
    return firebase.auth().currentUser;
  }

  userIsLoggedIn() {
    const currentUser = this.readCurrentUser();
    let isLoggedIn = false;

    if (currentUser) {
      isLoggedIn = true;
    }

    return isLoggedIn;
  }

  readUserData(userid) {
    return new Promise(resolve => {
      firebase
        .database()
        .ref(`/users/${userid}`)
        .once("value")
        .then(snapshot => {
          const { uid, username, email, photoURL } = snapshot.val();
          let result = {
            uid,
            username,
            email,
            photoURL
          };
          resolve(result);
        });
    });
  }

  createCommunityMembership(communityName) {
    const currentUserUid = firebase.auth().currentUser.uid;
    const joinedTime = firebase.database.ServerValue.TIMESTAMP;

    const promise = new Promise(resolve => {
      firebase
        .database()
        .ref(`/users/${currentUserUid}/joinedCommunities/${communityName}`)
        .set({
          communityName: communityName,
          joinedTime: joinedTime
        });
      resolve(true);
    });
    return promise;
  }

  deleteCommunityMembership(communityName) {
    const currentUserUid = firebase.auth().currentUser.uid;

    const promise = new Promise(resolve => {
      firebase
        .database()
        .ref(`/users/${currentUserUid}/joinedCommunities/${communityName}`)
        .remove();
      resolve(true);
    });
    return promise;
  }

  isSameUser(currentUserUid: String, targetUserUid: String) {
    if (currentUserUid == targetUserUid) {
      return true;
    } else {
      return false;
    }
  }

  isSameUsername(username: string) {
    username = username.toLowerCase();
    return this.fireusernames.child(username).once("value");
  }

  updateUserprofile(email: string, username: string) {
    let uid = firebase.auth().currentUser.uid;
    let data = {};
    data[username] = uid;
    var promise = new Promise(resolve => {
      firebase
        .auth()
        .currentUser.updateProfile({
          displayName: username,
          photoURL: "../../assets/round-account_circle.svg"
        })
        .then(() => {
          this.fireusers
            .child(uid)
            .update({
              email: email,
              uid: uid,
              username: username,
              greeting: "안녕하세요! " + username + " 입니다. 함께 나아가요!",
              photoURL: "../../assets/round-account_circle.svg"
            })
            .then(() => {
              this.fireusernames.update(data).then(() => {
                resolve(true);
              });
            });
        });
    });
    return promise;
  }

  getallUserprofiles() {
    var promise = new Promise(resolve => {
      this.fireusers.once("value").then(snapshot => {
        var userprofiles = [];
        snapshot.forEach(childSnapshot => {
          userprofiles.push(childSnapshot.val());
        });
        resolve(userprofiles);
      });
    });
    return promise;
  }

  updateProfilePicture(path) {
    const uid = firebase.auth().currentUser.uid;
    const promise = new Promise(resolve => {
      firebase
        .auth()
        .currentUser.updateProfile({
          displayName: firebase.auth().currentUser.displayName,
          photoURL: path
        })
        .then(() => {
          this.fireusers
            .child(uid)
            .update({
              photoURL: path
            })
            .then(() => {
              resolve(true);
            });
        });
    });
    return promise;
  }

  getUserprofile(uid) {
    if (uid) {
      var promise = new Promise(resolve => {
        this.fireusers
          .child(uid)
          .once("value")
          .then(snapshot => {
            resolve(snapshot.val());
          });
      });
      return promise;
    }
  }

  updateGreeting(greeting) {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise(resolve => {
      this.fireusers
        .child(uid)
        .update({
          greeting: greeting
        })
        .then(() => {
          resolve(true);
        });
    });
    return promise;
  }

  updatePassword(password) {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise(resolve => {
      this.fireusers
        .child(uid)
        .update({
          password: password
        })
        .then(() => {
          resolve(true);
        });
    });
    return promise;
  }
}

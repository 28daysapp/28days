import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class UserProvider {

  fireusers = firebase.database().ref('/users');
  fireusernames = firebase.database().ref('/usernames');
  photo;
  constructor() {

  }

  readUserCommunities() {
    var promise = new Promise((resolve) => {
      const communities = []
      const currentUserUid = firebase.auth().currentUser.uid;
  
      firebase.database().ref(`/users/${currentUserUid}`).child("joinedCommunities").once("value").then((snapshot)=>{
        snapshot.forEach((childSnapshot) => {
          const community = childSnapshot.val();
          communities.push(community);
        });
        resolve(communities);
      })
    });
    return promise;
  }

  createCommunityMembership(communityName) {
    const currentUserUid = firebase.auth().currentUser.uid;
    const promise = new Promise((resolve) => {
			firebase.database().ref(`/users/${currentUserUid}/joinedCommunities`).push({
        communityName: communityName
      });
      resolve(true);
		});
		return promise;
  }

  checkUser(currentUserUid: String, targetUserUid: String) {
    if (currentUserUid == targetUserUid) {
      return true
    } else {
      return false
    }
  }

  checkUsername(username: string) {
    username = username.toLowerCase();
    return this.fireusernames.child(username).once("value");
  }

  updateUserprofile(email: string, username: string) {
    let uid = firebase.auth().currentUser.uid;
    let data = {};
    data[username] = uid;
    var promise = new Promise((resolve) => {
      firebase.auth().currentUser.updateProfile({
        displayName: username,
        photoURL: "assets/profile0.png"
      }).then(() => {
        this.fireusers.child(uid).update({
          email: email,
          uid: uid,
          username: username,
          greeting: "안녕하세요! " + username + " 입니다. 함께 나아가요!",
          photoURL: "assets/profile0.png"
        }).then(() => {
          this.fireusernames.update(data).then(() => {
            resolve(true);
          });
        });
      });
    });
    return promise;
  }

  getallUserprofiles() {
    var promise = new Promise((resolve) => {
      this.fireusers.once("value").then((snapshot) => {
        var userprofiles = [];
        snapshot.forEach((childSnapshot) => {
          userprofiles.push(childSnapshot.val());
        });
        resolve(userprofiles);
      });
    });
    return promise;
  }

  updatePhoto(path) {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      firebase.auth().currentUser.updateProfile({
        displayName: firebase.auth().currentUser.displayName,
        photoURL: path
      }).then(() => {
        this.fireusers.child(uid).update({
          photoURL: path
        }).then(() => {
          resolve(true);
        });
      });
    });
    return promise;
  }

  getUserprofile(uid) {
    var promise = new Promise((resolve) => {
      this.fireusers.child(uid).once("value").then((snapshot) => {
        resolve(snapshot.val());
      });
    });
    return promise;
  }

  updateGreeting(greeting) {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      this.fireusers.child(uid).update({
        greeting: greeting
      }).then(() => {
        resolve(true);
      });
    });
    return promise;
  }

  updatePassword(password) {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      this.fireusers.child(uid).update({
        password: password
      }).then(() => {
        resolve(true);
      });
    });
    return promise;
  }

  addToken() {
    var uid = firebase.auth().currentUser.uid;
  }

}

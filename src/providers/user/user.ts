import { Injectable } from '@angular/core';
import firebase from 'firebase';



/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  fireusers = firebase.database().ref('/users');
  fireusernames = firebase.database().ref('/usernames');
  photo;
  constructor() {
    
  }


	checkUsername(username: string) {
  	username = username.toLowerCase();
    return this.fireusernames.child(username).once("value");
   }
   
   searchuser(){
     
   }

 	updateUserprofile(email:string, username: string, gender: string, age) {
    var uid = firebase.auth().currentUser.uid;
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
          gender: gender,
          age: age,
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
        console.info("Receiving Token?: " + JSON.stringify(snapshot));
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

  updatePassword(password){
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

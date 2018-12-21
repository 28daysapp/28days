import { Injectable } from "@angular/core";
import firebase from "firebase";

@Injectable()
export class OperatorProvider {
  fireuser = firebase.database().ref("/users");
  firesupporter = firebase.database().ref("/supporter");
  fireoperator = firebase.database().ref("/operator");
  firecounselor = firebase.database().ref("/counselor");
  firegeneral = firebase.database().ref("/general");

  constructor() {
    console.log("Hello OperatorProvider Provider");
  }

  addgeneral(user) {
    this.firesupporter.child(`${user.uid}`).remove();
    this.firecounselor.child(`${user.uid}`).remove();
    return new Promise(resolve => {
      this.firegeneral
        .child(`${user.uid}`)
        .set({
          uid: user.uid,
          username: user.username
        })
        .then(() => {
          this.fireuser.child(`${user.uid}`).update({
            usertype: "general"
          });
          resolve(true);
        });
    });
  }

  addsuporter(user) {
    return new Promise(resolve => {
      this.firegeneral.child(`${user.uid}`).remove();
      this.firesupporter
        .child(`${user.uid}`)
        .set({
          uid: user.uid,
          username: user.username,
          count: 0,
          greeting: "안녕하세요! 서포터 " + user.username + "입니다.",
          tag: null,
          gender: user.gender,
          photoURL: user.photoURL,
          age: user.age,
          reviewcnt: 0,
          token: user.token
        })
        .then(() => {
          this.fireuser.child(`${user.uid}`).update({
            usertype: "supporter"
          });
          resolve(true);
        });
    });
  }

  addcounselor(user) {
    return new Promise(resolve => {
      this.firegeneral.child(`${user.uid}`).remove();
      this.firecounselor
        .child(`${user.uid}`)
        .set({
          uid: user.uid,
          username: user.username,
          count: 0,
          rating: 0,
          greeting: "안녕하세요! 상담사 " + user.username + "입니다.",
          tag: null,
          gender: user.gender,
          age: user.age,
          photoURL: user.photoURL,
          reviewcnt: 0,
          ratingavg: 0,
          token: user.token
        })
        .then(() => {
          this.fireuser.child(`${user.uid}`).update({
            usertype: "counselor"
          });
          resolve(true);
        });
    });
  }

  addoperator(user) {
    return new Promise(resolve => {
      this.fireuser.child(`${user.uid}`).update({
        operator: true
      });
      resolve(true);
    });
  }

  deleteOperator(user) {
    return new Promise(resolve => {
      this.fireuser.child(`${user.uid}`).update({
        operator: false
      });
      resolve(true);
    });
  }
}

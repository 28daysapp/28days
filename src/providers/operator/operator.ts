import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the OperatorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OperatorProvider {

  fireuser = firebase.database().ref('/users');
  firesupporter = firebase.database().ref('/supporter');
  fireoperator = firebase.database().ref('/operator');
  firecounselor = firebase.database().ref('/counselor');
  firegeneral = firebase.database().ref('/general');

  constructor() {
    console.log('Hello OperatorProvider Provider');
  }

  addgeneral(user) {
    this.firesupporter.child(`${user.uid}`).remove();
    this.firecounselor.child(`${user.uid}`).remove();
    var promise = new Promise((resolve) => {
      this.firegeneral.child(`${user.uid}`).set({
        uid: user.uid,
        username: user.username
      }).then(() => {
        this.fireuser.child(`${user.uid}`).update({
          usertype: 'general'
        });
        resolve(true);
      });
    });
    return promise;
  }

  addsuporter(user){
    var promise = new Promise((resolve) => {
      this.firegeneral.child(`${user.uid}`).remove();
      this.firesupporter.child(`${user.uid}`).set({
        uid: user.uid,
        username: user.username,
        count: 0,
        greeting: '안녕하세요! 서포터 ' + user.username + '입니다.',
        tag: null,
        gender: user.gender,
        age: user.age,
        reviewcnt: 0
      }).then(() => {
        this.fireuser.child(`${user.uid}`).update({
          usertype: 'supporter'
        });
        resolve(true);
      });
    });
    return promise;
  }

  addcounselor(user){
    var promise = new Promise((resolve) => {
      this.firegeneral.child(`${user.uid}`).remove();
      this.firecounselor.child(`${user.uid}`).set({
        uid: user.uid,
        username: user.username,
        count: 0,
        rating: 0,
        greeting: '안녕하세요! 상담사 ' + user.username + '입니다.',
        tag: null,
        gender: user.gender,
        age: user.age,
        photoURL: user.photoURL,
        reviewcnt: 0
      }).then(() => {
        this.fireuser.child(`${user.uid}`).update({
          usertype: 'counselor'
        });
        resolve(true);
      });
    });
    return promise;
  }

  addoperator(user){
    var promise = new Promise((resolve) => {
        this.fireuser.child(`${user.uid}`).update({
          operator: true
        });
        resolve(true);
      });
    return promise;
  }

  
}

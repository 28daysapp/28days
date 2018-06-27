import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the EmotionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EmotionProvider {
	fireemotion = firebase.database().ref('/emotions');
	length = 0;
  constructor() {
  }

  updateEmotion(length) {
  	var uid = firebase.auth().currentUser.uid;
  	this.length = length;
  	return this.fireemotion.child(uid).set({length: length});
  }

  getEmotion() {
  	var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      this.fireemotion.child(uid).once("value").then((snapshot) => {
      	if (snapshot.val()) {
	      	this.length = snapshot.val().length;
	      	resolve(snapshot.val().length);
	      } else {
	      	this.length = 0;
	      	resolve(0);
	      }
      });
    });
    return promise;
  }

}

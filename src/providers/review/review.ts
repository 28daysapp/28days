import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ReviewProvider {

  fireReview = firebase.database().ref('/review/');
  placeId;
  text;
  rating;

  constructor() {
    console.log('Hello ReviewProvider Provider');
  }

  writeReview(placeId, text) {
    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      var newPostRef = this.fireReview.child(placeId).push();
      var time = firebase.database.ServerValue.TIMESTAMP;
      var postId = newPostRef.key;

      newPostRef.set({
        placeId: placeId,
        postId: postId,
        uid: uid,
        username: firebase.auth().currentUser.displayName,
        text: text,
        timestamp: time,
        report: 0
      }).then(() => {
        resolve(true);
      });

    });

    return promise;
  }

  getReviews() {

  }

  getsearchposts(tag){
		var uid = firebase.auth().currentUser.uid;
		var promise = new Promise((resolve) => {
			this.fireReview.child(``).orderByChild('timestamp').once("value").then((snapshot) => {
				
			});
		});
		return promise;
	}


  // this.firecomment.child(`${ this.community.namecom }/${ this.postid }`).on('value', (snapshot) => {
  //   this.comments = [];
  //   for (var i in snapshot.val()) {
  //     this.comments.push(snapshot.val()[i]);
  //   }
  //   this.events.publish('community-newcomment');
  // });


}

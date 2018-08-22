import { Injectable } from '@angular/core';
import firebase from 'firebase';



@Injectable()
export class ReviewProvider {

  fireReview = firebase.database().ref(`/review/`);
  user;
  placeId;
  text;
  rating;

  constructor() {
    console.log('Hello ReviewProvider Provider');
  }

  writeReview(placeId, rating, text) {

    var uid = firebase.auth().currentUser.uid;
    var promise = new Promise((resolve) => {
      var newPostRef = firebase.database().ref(`/review/` + placeId).push();
      var time = firebase.database.ServerValue.TIMESTAMP;
      var postId = newPostRef.key;

      var ratingAvg = (rating[0] + rating[1] + rating[2] + rating[3]) / 4.0;

      newPostRef.set({
        postId: postId,
        uid: uid,
        rating: rating,
        ratingAvg: ratingAvg,
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

  getReviews(placeId) {
    this.placeId = placeId;

    var promise = new Promise((resolve) => {
      var posts = [];
      this.fireReview.child(this.placeId).once("value").then((snapshot) => { // fireReview에서 시간 순으로 가져오고 snapshot에 하나씩 가져옴
        snapshot.forEach((childSnapshot) => { //스냅샷의 child개수만큼 for
          posts.push(childSnapshot.val());
          posts.reverse();
          resolve(posts); //여기서 post를 보내주는 것 같다
        });
      });
    });

    return promise;

  }

  getsearchposts(tag) {
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

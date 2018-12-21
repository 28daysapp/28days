import { Injectable } from "@angular/core";
import firebase from "firebase";

@Injectable()
export class ReviewProvider {
  fireReview = firebase.database().ref(`/review/`);
  user;
  placeId;
  text;
  rating;
  reviewCount;

  constructor() {
    console.log("Hello ReviewProvider Provider");
  }

  createReview(placeId, placeName, rating, text) {
    const uid = firebase.auth().currentUser.uid;
    const promise = new Promise(resolve => {
      const newPostRef = firebase
        .database()
        .ref(`/review/` + placeId)
        .push();
      const time = firebase.database.ServerValue.TIMESTAMP;
      const postId = newPostRef.key;

      const ratingAvg = (rating[0] + rating[1] + rating[2] + rating[3]) / 4.0;

      newPostRef
        .set({
          placeName: placeName,
          postId: postId,
          uid: uid,
          rating: rating,
          ratingAvg: ratingAvg,
          username: firebase.auth().currentUser.displayName,
          text: text,
          timestamp: time,
          report: 0
        })
        .then(() => {
          this.countReviews(placeId);
          resolve(true);
        });
    });

    return promise;
  }

  countReviews(placeId) {
    return new Promise(resolve => {
      firebase
        .database()
        .ref("/review/" + placeId)
        .once("value", function(snap) {
          firebase
            .database()
            .ref(`/placeInfo/` + placeId)
            .update({
              reviewCount: snap.numChildren()
            });
        });
      return resolve;
    });
  }

  readReviews(placeId) {
    this.placeId = placeId;

    const promise = new Promise(resolve => {
      const posts = [];
      this.fireReview
        .child(this.placeId)
        .orderByChild("timestamp")
        .once("value")
        .then(snapshot => {
          snapshot.forEach(childSnapshot => {
            posts.push(childSnapshot.val());
            posts.reverse();
            resolve(posts);
          });
        });
    });

    return promise;
  }

  countTotalReviews() {
    let reviewCount = 0;
    const promise = new Promise(resolve => {
      this.fireReview.once("value").then(snapshot => {
        snapshot.forEach(childSnapshot => {
          childSnapshot.forEach(() => {
            reviewCount += 1;
          });
        });
        resolve(reviewCount);
      });
    });
    return promise;
  }
}

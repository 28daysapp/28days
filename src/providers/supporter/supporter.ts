
import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the SupporterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SupporterProvider {
  firesupporterreview = firebase.database().ref('/supporterreview');
  firesupporterreviewsum = firebase.database().ref('/supporterreviewsum');
  count;
  reviewrating;
  constructor() {
    console.log('Hello SupporterProvider Provider');

    this.count = 0;
  }

  addsupporterreview(supporterid, rating1, rating2, rating3, rating4, comment) {
    var uid = firebase.auth().currentUser.uid;
    var newReviewRef = this.firesupporterreview.push();
    var reviewid = newReviewRef.key;
    var promise = new Promise((resolve) => {
      this.firesupporterreview.child(`${supporterid}/${reviewid}`).set({//firemypost에 값 넣기
        supporterid: supporterid,
        reviewid: reviewid,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        rating1: rating1,
        rating2: rating2,
        rating3: rating3,
        rating4: rating4,
        comment: comment,
        uid: uid
      }).then(() => {
        this.sumrating(rating1, rating2, rating3, rating4, supporterid);
        resolve(true);
      });
    });
    return promise;
  }

  sumrating(r1, r2, r3, r4, supporterid) {

    var promise = new Promise((resolve) => {
      this.getreviewrating(supporterid).then((reviewrating) => {
        this.reviewrating = reviewrating;
        if (this.reviewrating == null) {
          this.firesupporterreviewsum.child(`${supporterid}`).set({
            ratingA: r1,
            ratingB: r2,
            ratingC: r3,
            ratingD: r4,
            count: 1
          }).then(() => {
            resolve(true);
          });
        } else {
          this.firesupporterreviewsum.child(`${supporterid}`).set({
            ratingA: this.reviewrating.ratingA + r1,
            ratingB: this.reviewrating.ratingB + r2,
            ratingC: this.reviewrating.ratingC + r3,
            ratingD: this.reviewrating.ratingD + r4,
            count: this.reviewrating.count + 1
          }).then(() => {
            resolve(true);
          });
        }
      });
    });
    return promise;
  }

  getreviewrating(supporterid) {
    var promise = new Promise((resolve) => {
      var reviewrating;
      this.firesupporterreviewsum.child(supporterid).once("value").then((snapshot) => {
        reviewrating = snapshot.val();
        resolve(reviewrating);
      });
    });
    return (promise);
  }

  getallreview(supporterid) {
    var promise = new Promise((resolve) => {
      var reviews = [];
      this.firesupporterreview.child(supporterid).orderByChild('timestamp').once("value").then((snapshot) => { // firemypost에서 시간 순으로 가져오고 snapshot에 하나씩 가져옴
        snapshot.forEach((childSnapshot) => {
          var review = childSnapshot.val();
          reviews.push(review);
          reviews.reverse();
          resolve(reviews);
        });
      });
    });
    return promise;
  }

}

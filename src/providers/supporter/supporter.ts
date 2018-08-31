
import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the SupporterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SupporterProvider {
  firesupporter = firebase.database().ref('/supporter');
  firesupporterreview = firebase.database().ref('/supporterreview');
  firesupporterreviewsum = firebase.database().ref('/supporterreviewsum');
  count;
  reviewrating;
  constructor() {
    console.log('Hello SupporterProvider Provider');

    this.count = 0;
  }

  addsupporterreview(supporterid, comment) {
    var uid = firebase.auth().currentUser.uid;
    var newReviewRef = this.firesupporterreview.push();
    var reviewid = newReviewRef.key;
    var promise = new Promise((resolve) => {
      this.firesupporterreview.child(`${supporterid}/${reviewid}`).set({//firemypost에 값 넣기
        supporterid: supporterid,
        reviewid: reviewid,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        comment: comment,
        uid: uid
      }).then(() => {
        this.addsupportersum(supporterid);
        resolve(true);
      });
    });
    return promise;
  }

  addsupportersum(supporterid) {
    var supporter;
    var promise = new Promise((resolve) => {
      this.firesupporterreview.child(supporterid).once("value").then((snapshot) => {
        console.log(snapshot.numChildren())
      this.firesupporter.child(`${supporterid}`).update({
        reviewcnt: snapshot.numChildren()
      }).then(() => {
        resolve(true);
      });
    });
  });
  console.log('1');
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

  getsupporter(supporterid) {
    var promise = new Promise((resolve) => {
      var supporter;
      this.firesupporter.child(supporterid).once("value").then((snapshot) => {
        supporter = snapshot.val();
        resolve(supporter);
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

  getsumrating(supporterid) {
    var sum;
    this.getreviewrating(supporterid).then((reviewrating) => {
      this.reviewrating = reviewrating;
      if (this.reviewrating == null) {
        return 0
      }
      else {
        sum = this.reviewrating.ratingA + this.reviewrating.ratingB + this.reviewrating.ratingC + this.reviewrating.ratingD
        sum = sum + (this.reviewrating.count * 4);
        return sum;
      }
    });
  }
}

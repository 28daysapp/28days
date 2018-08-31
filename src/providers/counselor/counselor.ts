import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the CounselorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CounselorProvider {
  firecounselor = firebase.database().ref('/counselor');
  firecounselorreview = firebase.database().ref('/counselorreview');
  firecounselorreviewsum = firebase.database().ref('/counselorreviewsum');
  count;
  reviewrating;

  constructor() {
    console.log('Hello CounselorProvider Provider');

    this.count = 0;
  }

  addcounselorreview(counselorid, rating1, rating2, rating3, rating4, comment, username) {
    var uid = firebase.auth().currentUser.uid;
    var newReviewRef = this.firecounselorreview.push();
    var reviewid = newReviewRef.key;
    var promise = new Promise((resolve) => {
      this.firecounselorreview.child(`${counselorid}/${reviewid}`).set({//firemypost에 값 넣기
        counselorid: counselorid,
        reviewid: reviewid,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        rating1: rating1,
        rating2: rating2,
        rating3: rating3,
        rating4: rating4,
        comment: comment,
        uid: uid,
        username: username
      }).then(() => {
        this.sumrating(rating1, rating2, rating3, rating4, counselorid);
        this.addcounselorsum(counselorid);
        resolve(true);
      });
    });
    return promise;
  }
  addcounselorsum(counselorid) {
    var promise = new Promise((resolve) => {
      this.firecounselorreview.child(counselorid).once("value").then((snapshot) => {
        console.log(snapshot.numChildren())
      this.firecounselor.child(`${counselorid}`).update({
        reviewcnt: snapshot.numChildren()
      }).then(() => {
        resolve(true);
      });
    });
  });
  console.log('1');
  }

  sumrating(r1, r2, r3, r4, counselorid) {
    var avg;
    avg = this.getsumrating(counselorid);
    var promise = new Promise((resolve) => {
      this.getreviewrating(counselorid).then((reviewrating) => {
        this.reviewrating = reviewrating;
        if (this.reviewrating == null) {
          this.firecounselorreviewsum.child(`${counselorid}`).set({
            ratingA: r1,
            ratingB: r2,
            ratingC: r3,
            ratingD: r4,
            count: 1,
            ratingsum: (r1+r2+r3+r4)
          }).then(() => {
            this.firecounselor.child(`${counselorid}`).update({
              ratingavg: (r1+r2+r3+r4)/4
            });
            resolve(true);
          });
        } else {
          this.firecounselorreviewsum.child(`${counselorid}`).set({
            ratingA: this.reviewrating.ratingA + r1,
            ratingB: this.reviewrating.ratingB + r2,
            ratingC: this.reviewrating.ratingC + r3,
            ratingD: this.reviewrating.ratingD + r4,
            count: this.reviewrating.count + 1,
            ratingsum: this.reviewrating.ratingsum + (r1+r2+r3+r4)
          }).then(() => {
            this.firecounselor.child(`${counselorid}`).update({
              ratingavg: ((this.reviewrating.ratingsum)+(r1+r2+r3+r4))/((this.reviewrating.count+1)*4)
            });
            resolve(true);
          });
        }
      });
    });
    return promise;
  }

  getreviewrating(counselorid) {
    var promise = new Promise((resolve) => {
      var reviewrating;
      this.firecounselorreviewsum.child(counselorid).once("value").then((snapshot) => {
        reviewrating = snapshot.val();
        resolve(reviewrating);
      });
    });
    return (promise);
  }

  getcounselor(counserlorid) {
    var promise = new Promise((resolve) => {
      var counselor;
      this.firecounselor.child(counserlorid).once("value").then((snapshot) => {
        counselor = snapshot.val();
        resolve(counselor);
      });
    });
    return (promise);
  }

  getallreview(counselorid) {
    var promise = new Promise((resolve) => {
      var reviews = [];
      this.firecounselorreview.child(counselorid).orderByChild('timestamp').once("value").then((snapshot) => { // firemypost에서 시간 순으로 가져오고 snapshot에 하나씩 가져옴
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

  getsumrating(counselorid) {
    var sum;
    this.getreviewrating(counselorid).then((reviewrating) => {
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

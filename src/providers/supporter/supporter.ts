import { Injectable } from "@angular/core";
import firebase from "firebase";

@Injectable()
export class SupporterProvider {
  firesupporter = firebase.database().ref("/supporter");
  firesupporterreview = firebase.database().ref("/supporterreview");
  firesupporterreviewsum = firebase.database().ref("/supporterreviewsum");
  count;
  reviewrating;
  constructor() {
    console.log("Hello SupporterProvider Provider");

    this.count = 0;
  }

  addsupporterreview(supporterid, comment, username) {
    const uid = firebase.auth().currentUser.uid;
    const newReviewRef = this.firesupporterreview.push();
    const reviewid = newReviewRef.key;
    const promise = new Promise(resolve => {
      this.firesupporterreview
        .child(`${supporterid}/${reviewid}`)
        .set({
          //firemypost에 값 넣기
          supporterid: supporterid,
          reviewid: reviewid,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          comment: comment,
          uid: uid,
          username: username
        })
        .then(() => {
          this.addsupportersum(supporterid);
          resolve(true);
        });
    });
    return promise;
  }

  addsupportersum(supporterid) {
    const promise = new Promise(resolve => {
      this.firesupporterreview
        .child(supporterid)
        .once("value")
        .then(snapshot => {
          this.firesupporter
            .child(`${supporterid}`)
            .update({
              reviewcnt: snapshot.numChildren()
            })
            .then(() => {
              resolve(true);
            });
        });
    });
    return promise;
  }

  sumrating(r1, r2, r3, r4, supporterid) {
    const promise = new Promise(resolve => {
      this.getreviewrating(supporterid).then(reviewrating => {
        this.reviewrating = reviewrating;
        if (this.reviewrating == null) {
          this.firesupporterreviewsum
            .child(`${supporterid}`)
            .set({
              ratingA: r1,
              ratingB: r2,
              ratingC: r3,
              ratingD: r4,
              count: 1
            })
            .then(() => {
              resolve(true);
            });
        } else {
          this.firesupporterreviewsum
            .child(`${supporterid}`)
            .set({
              ratingA: this.reviewrating.ratingA + r1,
              ratingB: this.reviewrating.ratingB + r2,
              ratingC: this.reviewrating.ratingC + r3,
              ratingD: this.reviewrating.ratingD + r4,
              count: this.reviewrating.count + 1
            })
            .then(() => {
              resolve(true);
            });
        }
      });
    });
    return promise;
  }

  getreviewrating(supporterid) {
    const promise = new Promise(resolve => {
      this.firesupporterreviewsum
        .child(supporterid)
        .once("value")
        .then(snapshot => {
          const reviewrating = snapshot.val();
          resolve(reviewrating);
        });
    });
    return promise;
  }

  getsupporter(supporterid) {
    const promise = new Promise(resolve => {
      this.firesupporter
        .child(supporterid)
        .once("value")
        .then(snapshot => {
          const supporter = snapshot.val();
          resolve(supporter);
        });
    });
    return promise;
  }

  getallreview(supporterid) {
    const promise = new Promise(resolve => {
      const reviews = [];
      this.firesupporterreview
        .child(supporterid)
        .orderByChild("timestamp")
        .once("value")
        .then(snapshot => {
          // firemypost에서 시간 순으로 가져오고 snapshot에 하나씩 가져옴
          snapshot.forEach(childSnapshot => {
            const review = childSnapshot.val();
            reviews.push(review);
            reviews.reverse();
            resolve(reviews);
          });
        });
    });
    return promise;
  }

  getsumrating(supporterid) {
    this.getreviewrating(supporterid).then(reviewrating => {
      this.reviewrating = reviewrating;
      if (this.reviewrating == null) {
        return 0;
      } else {
        let sum =
          this.reviewrating.ratingA +
          this.reviewrating.ratingB +
          this.reviewrating.ratingC +
          this.reviewrating.ratingD;
        sum = sum / (this.reviewrating.count * 4);
        return sum;
      }
    });
  }
}

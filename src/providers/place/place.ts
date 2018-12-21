import { Injectable } from "@angular/core";
import firebase from "firebase";

@Injectable()
export class PlaceProvider {
  firestore = firebase.storage();

  constructor() {
    console.log("Hello PlaceProvider Provider");
  }

  readPlaceList(reference: String) {
    console.log("reference: ", reference);
    return new Promise(resolve => {
      firebase
        .database()
        .ref(`${reference}Information`)
        .once("value")
        .then(snapshot => {
          const places = [];
          snapshot.forEach(childSnapshot => {
            const place = childSnapshot.val();
            places.push(place);
          });
          resolve(places);
        });
    });
  }

  readPlaceReviews(placeId: String) {
    return new Promise(resolve => {
      firebase
        .database()
        .ref(`/placeInfo/${placeId}`)
        .once("value")
        .then(snapshot => {
          if (snapshot.val() === null) {
            resolve(false);
          } else {
            resolve(snapshot.val());
          }
        });
    });
  }
}

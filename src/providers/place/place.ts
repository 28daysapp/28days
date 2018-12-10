import { Injectable } from "@angular/core";
import firebase from "firebase";

@Injectable()
export class PlaceProvider {
  firestore = firebase.storage();

  constructor() {
    console.log("Hello PlaceProvider Provider");
  }

  // <Function to Read Place List>
  // Reference: String, Accepting Values: 'hospital', 'center'
  readPlaceList(reference: String) {
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
          console.log(places);
          resolve(places);
        });
    });
  }
}

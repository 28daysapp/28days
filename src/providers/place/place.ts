import { Injectable } from '@angular/core';
import firebase from 'firebase';


@Injectable()
export class PlaceProvider {

  constructor() {
    console.log('Hello PlaceProvider Provider');
  }

  countReviews(places, placeId, i) {

    return new Promise((resolve, reject)=>{
      firebase.database().ref('/placeInfo/' + placeId).once('value').then((snapshot) => {
        if (snapshot.val() === null) {
          return
        }
        places[i].reviewCount = snapshot.val().reviewCount;
        places[i].ratings = snapshot.val().ratings;

        resolve(places)
      })
      .catch((error)=>{
        reject(error)
      });
    })

  }

}

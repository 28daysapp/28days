import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import firebase from "firebase";
import { FirstRunPage } from "../pages";

export const firebaseConfig = {
  apiKey: "AIzaSyAFjTzQOcwJrMPpmvOtT9boYuhYJxKI88U",
  authDomain: "days-fd14f.firebaseapp.com",
  databaseURL: "https://days-fd14f.firebaseio.com",
  projectId: "days-fd14f",
  storageBucket: "days-fd14f.appspot.com",
  messagingSenderId: "209011208541"
};

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage = FirstRunPage;

  constructor(public platform: Platform, public statusBar: StatusBar) {
    try {
      firebase.initializeApp(firebaseConfig);
    } catch (error) {
      console.log(error);
    }

    platform.ready().then(() => {
      try {
        statusBar.styleDefault();
      } catch (error) {
        console.log(error);
      }
    });
  }
}

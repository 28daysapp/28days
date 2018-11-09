import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  @ViewChild(Slides) slides: Slides;

  user;

  constructor(public auth: AuthProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams
  ) { }

  ionViewWillEnter() {
    this.user = firebase.auth().currentUser;
    if (this.user) {
      this.navCtrl.push("TabsPage");
    } else {
      this.storage.get('localcred').then((localcred) => {
        if (localcred) {
          this.navCtrl.push("TabsPage");
        }
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 4) {
      this.navCtrl.push('ChatbotPage');
    }
  }
}

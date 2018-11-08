import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';


// import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  @ViewChild(Slides) slides: Slides;

  user;

  constructor(public auth: AuthProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams
    //, private nativePageTransitions: NativePageTransitions
    ) { }

  ionViewWillEnter() {
    this.user = firebase.auth().currentUser;
    if (this.user) {
      this.navCtrl.push("TabsPage");
    } else {
      this.storage.get('localcred').then((localcred) => {
        if (localcred) {
          // cache exists
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
    console.log('Current index is', currentIndex);
  
    if (currentIndex == 4) {
    //   let options: NativeTransitionOptions = {
    //     direction: 'left',
    //     duration: 3000,
    //     slowdownfactor: -5,
    //   };
    //   this.nativePageTransitions.slide(options);
      this.navCtrl.push('ChatbotPage');
    }
  }
}

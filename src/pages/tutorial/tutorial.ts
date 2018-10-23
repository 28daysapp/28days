import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
// import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams
    //, private nativePageTransitions: NativePageTransitions
    ) { }

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

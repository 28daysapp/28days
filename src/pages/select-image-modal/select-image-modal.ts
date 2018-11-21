import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-select-image-modal',
  templateUrl: 'select-image-modal.html',
})
export class SelectImageModalPage {

  images = [];
  selectedIndex;
  communityImageReference;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewController: ViewController, 
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectImageModalPage');
    this.initializeImages();
  }

  initializeImages(){
    console.log("initialize images")
    for (var i = 1; i < 15; i++) {
      this.images.push({reference: `../../assets/imgs/post${i}.jpg`})
    }
  }

  selectImage(selectedIndex){
    this.selectedIndex = selectedIndex;
    this.communityImageReference = `assets/imgs/post${selectedIndex + 1}.jpg`
  }

  dismissModal() {
    this.viewController.dismiss({
      communityImageReference : this.communityImageReference
    });
  }

}

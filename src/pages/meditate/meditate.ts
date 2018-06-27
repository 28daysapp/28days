import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MeditatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meditate',
  templateUrl: 'meditate.html',
})
export class MeditatePage {
  meditations;
  shownMeditation;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, ) {
  	this.meditations = [
	  	{
	  		name: "깊은 심호흡",
	  		audioSource: "assets/audio/sample1.m4a",
	  	},
	  	{
	  		name: "바디 스캔",
	  		audioSource: "assets/audio/sample2.m4a",
	  	},
	  	{
	  		name: "인내의 마음",
	  		audioSource: "assets/audio/sample3.m4a",
	  	},
	  	{
	  		name: "초심자의 마음",
	  		audioSource: "assets/audio/sample4.m4a",
	  	},
	  	{
	  		name: "나에 대한 신뢰",
	  		audioSource: "assets/audio/sample5.m4a",
	  	},
  	];
  	this.shownMeditation = null;
  }

  toggleMeditation(idx) {
    if (this.isMeditationShown(idx)) {
    	this.shownMeditation = null;
  } else {
    	this.shownMeditation = idx;
  }
  };

  isMeditationShown(idx) {
    return this.shownMeditation === idx;
  };
}

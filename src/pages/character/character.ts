import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';

/**
 * Generated class for the CharacterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-character',
  templateUrl: 'character.html',
})
export class CharacterPage {
	@ViewChild(Navbar) nb: Navbar;
  // flags which character is picked
	p = [false, false, false, false];
  // original character index
	originpick;
  // character index which user picks
	pick;
  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UserProvider,
  	public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
  	console.log('original profile index : ' + firebase.auth().currentUser.photoURL.charAt(14));
  	this.originpick = parseInt(firebase.auth().currentUser.photoURL.charAt(14));
  	this.pick = this.originpick;
    // set flags which character was set
  	if (this.pick != 0) {
  		this.p[this.pick - 1] = true;
  	}
    // set back button click listener
    this.nb.backButtonClick = () => {
      this.backhandler();
    };
  }

  backhandler() {
    // go to home page
  	this.navCtrl.setRoot('HomePage');
  }

  changecharacter(num) {
    // user pick a specific character (index : num)
  	this.p = [false, false, false, false];
  	this.p[num] = true;
  	this.pick = num + 1;
  }

  setcharacter() {
  	if (this.pick == this.originpick) {
      // not change character image
  		this.navCtrl.setRoot('HomePage');
  		return;
  	}
    // change character image
  	this.user.updatePhoto(`assets/profile${ this.pick }.png`).then(() => {
  		this.navCtrl.setRoot('HomePage');
  	});
  }

}

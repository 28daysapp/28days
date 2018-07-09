import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the CommunityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-searchhelp',
  templateUrl: 'searchhelp.html',
})
export class SearchhelpPage {

    params: Object;
    pushPage: any;

    constructor(public navCtrl: NavController) {
      
    }

    counseling() {
      this.navCtrl.push('SearchPage', {
        location: "c"
      });
    }

    psychiatric() {
      this.navCtrl.push('SearchPage', {
        location: "p"
      });
    }

}

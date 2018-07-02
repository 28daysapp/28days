import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { Tab1Root, Tab2Root, Tab3Root, Tab4Root, Tab5Root } from '../';

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;
  tab5Root: any = Tab5Root;

  tab1Title = " Home ";
  tab2Title = " 1:1 ";
  tab3Title = " ";
  tab4Title = " Community ";
  tab5Title = " My Page ";

  // customicon = "../assets/gogo.png";

  constructor(public navCtrl: NavController) {}

}

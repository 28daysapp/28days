import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, App, ToastController } from 'ionic-angular';

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

  tab1Title = "홈";
  tab2Title = "병원/센터";
  tab3Title = "온라인상담";
  tab4Title = "서포터/상담사";
  tab5Title = "커뮤니티";
  backBtn;
  constructor(public navCtrl: NavController, private app: App, private toastCtrl: ToastController, public platform: Platform, ) {

  }
}
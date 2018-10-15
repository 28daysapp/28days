import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, App, ToastController } from 'ionic-angular';

import { Tab1Root, Tab2Root, Tab3Root, Tab4Root, Tab5Root } from '../';

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

  tab1Title = "커뮤니티";
  tab2Title = "서포터";
  tab3Title = "채팅";
  tab4Title = "병원/센터";
  tab5Title = "프로필";
  lastBack;
  allowClose;
  constructor(public navCtrl: NavController, private app: App, private toastCtrl: ToastController, public platform: Platform, ) {

  }
}
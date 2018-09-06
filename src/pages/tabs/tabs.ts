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
  lastBack;
  allowClose;
  constructor(public navCtrl: NavController, private app: App, private toastCtrl: ToastController, public platform: Platform, ) {
    /*
    platform.registerBackButtonAction(() => {
      const overlay = this.app._appRoot._overlayPortal.getActive();
      const nav = this.app.getActiveNav();
      const closeDelay = 2000;
      const spamDelay = 500;

      if(overlay && overlay.dismiss){
        overlay.dismiss();
      } else if(nav.canGoBack()){
        nav.pop();
      } else if(Date.now() - this.lastBack > spamDelay && !this.allowClose){
        this.allowClose = true;
        let toast = this.toastCtrl.create({
          message : "한번 더 뒤로가기 하시면 종료됩니다.",
          duration: closeDelay,
          dismissOnPageChange: true
        });
        toast.onDidDismiss(() => {
          this.allowClose = false;
        });
        toast.present();
      } else if(Date.now() - this.lastBack < closeDelay && this.allowClose){
        platform.exitApp();
      }
      this.lastBack = Date.now();
    });
    */
  }
}
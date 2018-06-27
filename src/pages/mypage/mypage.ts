import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

/**
 * Generated class for the MypagePage page.
 *
 * S팅e https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mypage',
  templateUrl: 'mypage.html',
})
export class MypagePage {

	tab1: string = "MychatsPage";
  tab2: string = "MydepositoryPage";
  tab3: string = "MysettingPage";

  constructor() {
  }

}

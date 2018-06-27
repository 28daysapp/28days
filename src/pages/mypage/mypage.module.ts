import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MypagePage } from './mypage';

@NgModule({
  declarations: [
    MypagePage,
  ],
  imports: [
    IonicPageModule.forChild(MypagePage),
  ],
})
export class MypagePageModule {}

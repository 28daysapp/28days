import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupporterchatPage } from './supporterchat';

@NgModule({
  declarations: [
    SupporterchatPage,
  ],
  imports: [
    IonicPageModule.forChild(SupporterchatPage),
  ],
})
export class SupporterchatPageModule {}

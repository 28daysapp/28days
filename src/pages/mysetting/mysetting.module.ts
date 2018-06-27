import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MysettingPage } from './mysetting';

@NgModule({
  declarations: [
    MysettingPage,
  ],
  imports: [
    IonicPageModule.forChild(MysettingPage),
  ],
})
export class MysettingPageModule {}

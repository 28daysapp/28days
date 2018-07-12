import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CounselorchatPage } from './counselorchat';

@NgModule({
  declarations: [
    CounselorchatPage,
  ],
  imports: [
    IonicPageModule.forChild(CounselorchatPage),
  ],
})
export class CounselorchatPageModule {}

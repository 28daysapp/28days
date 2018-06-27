import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiaryPage } from './diary';

@NgModule({
  declarations: [
    DiaryPage,
  ],
  imports: [
    IonicPageModule.forChild(DiaryPage),
  ],
})
export class DiaryPageModule {}

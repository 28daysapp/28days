import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MychatsPage } from './mychats';

@NgModule({
  declarations: [
    MychatsPage,
  ],
  imports: [
    IonicPageModule.forChild(MychatsPage),
  ],
})
export class MychatsPageModule {}

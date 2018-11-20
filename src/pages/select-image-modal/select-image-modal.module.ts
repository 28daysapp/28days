import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectImageModalPage } from './select-image-modal';

@NgModule({
  declarations: [
    SelectImageModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectImageModalPage),
  ],
})
export class SelectImageModalPageModule {}

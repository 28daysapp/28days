import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CenterPage } from './center';

@NgModule({
  declarations: [
    CenterPage,
  ],
  imports: [
    IonicPageModule.forChild(CenterPage),
  ],
})
export class CenterPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MypostPage } from './mypost';

@NgModule({
  declarations: [
    MypostPage,
  ],
  imports: [
    IonicPageModule.forChild(MypostPage),
  ],
})
export class MypostPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OperatorPage } from './operator';

@NgModule({
  declarations: [
    OperatorPage,
  ],
  imports: [
    IonicPageModule.forChild(OperatorPage),
  ],
})
export class OperatorPageModule {}

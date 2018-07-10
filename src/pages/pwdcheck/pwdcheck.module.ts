import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PwdcheckPage } from './pwdcheck';

@NgModule({
  declarations: [
    PwdcheckPage,
  ],
  imports: [
    IonicPageModule.forChild(PwdcheckPage),
  ],
})
export class PwdcheckPageModule {}

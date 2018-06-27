import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestchatPage } from './requestchat';

@NgModule({
  declarations: [
    RequestchatPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestchatPage),
  ],
})
export class RequestchatPageModule {}

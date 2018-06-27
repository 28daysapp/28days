import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestedchatPage } from './requestedchat';

@NgModule({
  declarations: [
    RequestedchatPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestedchatPage),
  ],
})
export class RequestedchatPageModule {}

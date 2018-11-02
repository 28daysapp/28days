import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserNotificationPage } from './user-notification';

@NgModule({
  declarations: [
    UserNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(UserNotificationPage),
  ],
})
export class UserNotificationPageModule {}

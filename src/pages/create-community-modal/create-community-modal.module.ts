import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateCommunityModalPage } from './create-community-modal';

@NgModule({
  declarations: [
    CreateCommunityModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateCommunityModalPage),
  ],
})
export class CreateCommunityModalPageModule {}

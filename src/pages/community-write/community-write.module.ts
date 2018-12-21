import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityWritePage } from './community-write';

@NgModule({
  declarations: [
    CommunityWritePage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityWritePage),
  ],
})
export class CommunityWritePageModule {}

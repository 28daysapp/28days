import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityCommentPage } from './community-comment';

@NgModule({
  declarations: [
    CommunityCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityCommentPage),
  ],
})
export class CommunityCommentPageModule {}

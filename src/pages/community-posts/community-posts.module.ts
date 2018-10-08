import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityPostsPage } from './community-posts';

@NgModule({
  declarations: [
    CommunityPostsPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityPostsPage),
  ],
})
export class CommunityPostsPageModule {}

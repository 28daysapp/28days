import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityListPage } from './community-list';

@NgModule({
  declarations: [
    CommunityListPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityListPage),
  ],
})
export class CommunityListPageModule {}

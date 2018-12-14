import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupporterListPage } from './supporter-list';

@NgModule({
  declarations: [
    SupporterListPage,
  ],
  imports: [
    IonicPageModule.forChild(SupporterListPage),
  ],
})
export class SupporterListPageModule {}

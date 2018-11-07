import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaceListPage } from './place-list';

@NgModule({
  declarations: [
    PlaceListPage,
  ],
  imports: [
    IonicPageModule.forChild(PlaceListPage),
  ],
})
export class PlaceListPageModule {}

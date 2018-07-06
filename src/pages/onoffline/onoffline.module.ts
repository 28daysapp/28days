import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnofflinePage } from './onoffline';

@NgModule({
  declarations: [
    OnofflinePage,
  ],
  imports: [
    IonicPageModule.forChild(OnofflinePage),
  ],
})
export class OnofflinePageModule {}

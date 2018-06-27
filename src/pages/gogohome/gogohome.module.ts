import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GogohomePage } from './gogohome';

@NgModule({
  declarations: [
    GogohomePage,
  ],
  imports: [
    IonicPageModule.forChild(GogohomePage),
  ],
})
export class GogohomePageModule {}

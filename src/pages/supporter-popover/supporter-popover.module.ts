import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupporterPopoverPage } from './supporter-popover';

@NgModule({
  declarations: [
    SupporterPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(SupporterPopoverPage),
  ],
})
export class SupporterPopoverPageModule {}

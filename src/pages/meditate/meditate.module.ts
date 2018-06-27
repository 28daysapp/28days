import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeditatePage } from './meditate';

@NgModule({
  declarations: [
    MeditatePage,
  ],
  imports: [
    IonicPageModule.forChild(MeditatePage),
  ],
})
export class MeditatePageModule {}

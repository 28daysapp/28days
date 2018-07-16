import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewWritePage } from './review-write';

@NgModule({
  declarations: [
    ReviewWritePage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewWritePage),
  ],
})
export class ReviewWritePageModule {}

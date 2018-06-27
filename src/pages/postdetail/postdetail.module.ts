import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostdetailPage } from './postdetail';

@NgModule({
  declarations: [
    PostdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PostdetailPage),
  ],
})
export class PostdetailPageModule {}

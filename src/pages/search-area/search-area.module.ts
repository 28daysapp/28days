import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchAreaPage } from './search-area';

@NgModule({
  declarations: [
    SearchAreaPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchAreaPage),
  ],
})
export class SearchAreaPageModule { }

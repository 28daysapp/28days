import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CharacterPage } from './character';

@NgModule({
  declarations: [
    CharacterPage,
  ],
  imports: [
    IonicPageModule.forChild(CharacterPage),
  ],
})
export class CharacterPageModule {}

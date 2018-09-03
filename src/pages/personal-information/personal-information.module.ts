import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalInformationPage } from './personal-information';

@NgModule({
  declarations: [
    PersonalInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalInformationPage),
  ],
})
export class PersonalInformationPageModule {}

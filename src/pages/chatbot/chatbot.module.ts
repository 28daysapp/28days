import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatbotPage } from './chatbot';

@NgModule({
  declarations: [
    ChatbotPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatbotPage),
  ],
})
export class ChatbotPageModule {}

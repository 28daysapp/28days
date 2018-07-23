import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts';
import { HttpModule } from '@angular/http';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';

import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { ChatProvider } from '../providers/chat/chat';

import { IonicStorageModule } from '@ionic/storage';
import { EmotionProvider } from '../providers/emotion/emotion';
import { CommunityProvider } from '../providers/community/community';
import { CommunitycommentProvider } from '../providers/communitycomment/communitycomment';
import { PostProvider } from '../providers/post/post';
import { CommunityfixPage } from '../pages/communityfix/communityfix'
import { MyProvider } from '../providers/my/my'

// import { IamportService } from 'iamport-ionic-kcp';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//import { GroupProvider } from '../providers/group/group';
import { SearchPage } from '../pages/search/search';
import { Geolocation } from '@ionic-native/geolocation';
import { ReviewProvider } from '../providers/review/review';

import { FCM } from '@ionic-native/fcm'


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ChartsModule,
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    FilePath,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Geolocation,
    AuthProvider,
    UserProvider,
    ChatProvider,
    EmotionProvider,
    CommunityProvider,
    CommunitycommentProvider,
    PostProvider,
    MyProvider,
    CommunityfixPage,
    // IamportService,
    InAppBrowser,
    SearchPage,
    ReviewProvider,
    FCM
    //GroupProvider,
  ]
})
export class AppModule { }

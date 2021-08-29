import {Pipe, PipeTransform, Component} from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';


@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform 
{
    constructor(private sanitizer: DomSanitizer) 
    {

    }
    transform(url) 
    {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicStorageModule } from '@ionic/storage';

import { ModuleProvider } from '../providers/module-service';
import { AppConfig } from './app-config';
import { DatePipe } from '@angular/common';
import { SuperTabsModule } from '../ionic2-super-tabs/src';
import { Market } from '@ionic-native/market';
import { CallNumber } from '@ionic-native/call-number';
//import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { CalendarModule } from "ion2-calendar";
import { BrowserTab } from '@ionic-native/browser-tab';
import { Network } from '@ionic-native/network';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { OneSignal } from '@ionic-native/onesignal';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
//import { Facebook } from '@ionic-native/facebook';
//import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicImageLoader } from 'ionic-image-loader';
import { EmailComposer } from '@ionic-native/email-composer';
import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  declarations: [
    MyApp,
    SafePipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    CalendarModule,
    BrowserAnimationsModule,
    IonicImageLoader.forRoot(),
    IonicModule.forRoot(MyApp, 
    {
      preloadModules: true,
      backButtonText: '',
      platforms: 
      {
        ios: 
        {
          scrollAssist: false, 
          autoFocusAssist: false,
          statusbarPadding: false,
        },
        android: 
        {
          
        }
      }
    }),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    ModuleProvider,
    AppConfig,
    DatePipe,
    Market,
    CallNumber,
    BrowserTab,
    //YoutubeVideoPlayer,
    Network,
    NativePageTransitions,
    OneSignal,
    PhotoViewer,
    SpeechRecognition,
    //Facebook,
    //GooglePlus,
    NativeStorage,
    EmailComposer,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

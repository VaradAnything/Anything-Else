import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MobileOtpPage } from './mobile-otp';

@NgModule
({
  declarations: 
  [
    MobileOtpPage,
  ],
  imports: 
  [
    IonicPageModule.forChild(MobileOtpPage),
  ],
})
export class MobileOtpPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaqPage } from './faq';

@NgModule
({
  declarations: 
  [
    FaqPage,
  ],
  imports: 
  [
    IonicPageModule.forChild(FaqPage),
  ],
})
export class FaqPageModule {}

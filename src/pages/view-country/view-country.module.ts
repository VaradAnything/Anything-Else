import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCountryPage } from './view-country';

@NgModule
({
  declarations: 
  [
    ViewCountryPage,
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewCountryPage),
  ],
})
export class ViewCountryPageModule {}

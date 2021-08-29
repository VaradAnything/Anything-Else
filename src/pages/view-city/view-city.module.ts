import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCityPage } from './view-city';

@NgModule
({
  declarations: 
  [
    ViewCityPage,
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewCityPage),
  ],
})
export class ViewCityPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewStatePage } from './view-state';

@NgModule
({
  declarations: 
  [
    ViewStatePage,
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewStatePage),
  ],
})
export class ViewStatePageModule {}

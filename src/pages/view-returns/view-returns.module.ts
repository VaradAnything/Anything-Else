import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewReturnsPage } from './view-returns';
import { ScrollHideDirective } from '../../directives/scroll-hide/return-orders-scroll-hide';

@NgModule
({
  declarations: 
  [
    ViewReturnsPage,
    ScrollHideDirective
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewReturnsPage),
  ],
  schemas: 
  [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ViewReturnsPageModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReturnOrderPage } from './return-order';
import { ScrollHideDirective } from '../../directives/scroll-hide/return-order-scroll-hide';

@NgModule
({
  declarations: 
  [
    ReturnOrderPage,
    ScrollHideDirective
  ],
  imports: 
  [
    IonicPageModule.forChild(ReturnOrderPage),
  ],
  schemas: 
  [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ReturnOrderPageModule {}

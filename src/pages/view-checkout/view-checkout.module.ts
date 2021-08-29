import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCheckoutPage } from './view-checkout';
import { ScrollHideDirective } from '../../directives/scroll-hide/checkout-scroll-hide';

@NgModule
({
  declarations: 
  [
    ViewCheckoutPage,
    ScrollHideDirective
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewCheckoutPage),
  ],
  schemas: 
  [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ViewCheckoutPageModule {}

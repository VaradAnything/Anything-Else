import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewMyCartPage } from './view-my-cart';
import { ScrollHideDirective } from '../../directives/scroll-hide/cart-scroll-hide';

@NgModule
({
  declarations: 
  [
    ViewMyCartPage,
    ScrollHideDirective
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewMyCartPage),
  ],
  schemas: 
  [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ViewMyCartPageModule {}

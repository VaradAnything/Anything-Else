import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewOrdersPage } from './view-orders';
import { ScrollHideDirective } from '../../directives/scroll-hide/orders-scroll-hide';

@NgModule
({
  declarations: 
  [
    ViewOrdersPage,
    ScrollHideDirective
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewOrdersPage),
  ],
  schemas: 
  [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ViewOrdersPageModule {}

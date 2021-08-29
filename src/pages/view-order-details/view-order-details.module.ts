import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewOrderDetailsPage } from './view-order-details';
import { ScrollHideDirective } from '../../directives/scroll-hide/orders-details-scroll-hide';

@NgModule
({
  declarations: 
  [
    ViewOrderDetailsPage,
    ScrollHideDirective
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewOrderDetailsPage),
  ],
  schemas: 
  [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ViewOrderDetailsPageModule {}

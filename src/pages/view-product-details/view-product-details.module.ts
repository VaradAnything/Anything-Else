import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewProductDetailsPage } from './view-product-details';
import { ParallaxHeader } from '../../directives/parallax-header/parallax-header';
import { ScrollHideDirective } from '../../directives/scroll-hide/product-details-scroll-hide';

@NgModule
({
  declarations: 
  [
    ViewProductDetailsPage,
    ParallaxHeader,
    ScrollHideDirective
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewProductDetailsPage),
  ],
  schemas: 
  [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ViewProductDetailsPageModule {}

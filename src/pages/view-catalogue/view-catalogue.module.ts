import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCataloguePage } from './view-catalogue';
import { ScrollHideDirective } from '../../directives/scroll-hide/catalogue-scroll-hide';
import { IonicImageLoader } from 'ionic-image-loader';
import { TooltipsModule } from 'ionic-tooltips';

@NgModule
({
  declarations: 
  [
    ViewCataloguePage,
    ScrollHideDirective
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewCataloguePage),
    IonicImageLoader,
    TooltipsModule.forRoot(),

  ],
  schemas: 
  [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ViewCataloguePageModule {}

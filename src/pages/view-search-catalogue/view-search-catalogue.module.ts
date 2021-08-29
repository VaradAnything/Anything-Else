import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewSearchCataloguePage } from './view-search-catalogue';
import { ScrollHideDirective } from '../../directives/scroll-hide/search-catalogue-scroll-hide';
import { IonicImageLoader } from 'ionic-image-loader';
import { TooltipsModule } from 'ionic-tooltips';

@NgModule
({
  declarations: 
  [
    ViewSearchCataloguePage,
    ScrollHideDirective
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewSearchCataloguePage),
    IonicImageLoader,
    TooltipsModule.forRoot(),
  ],
  schemas: 
  [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ViewSearchCataloguePageModule {}

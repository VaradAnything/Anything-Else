import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewMainCategoriesPage } from './view-main-categories';
import { ScrollHideDirective } from '../../directives/scroll-hide/main-category-scroll-hide';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule
({
  declarations: 
  [
    ViewMainCategoriesPage,
    ScrollHideDirective
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewMainCategoriesPage),
    IonicImageLoader
  ],
  schemas: 
  [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ViewMainCategoriesPageModule {}

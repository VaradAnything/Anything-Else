import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewSubCategoriesPage } from './view-sub-categories';

@NgModule
({
  declarations: 
  [
    ViewSubCategoriesPage,
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewSubCategoriesPage),
  ],
})
export class ViewSubCategoriesPageModule {}

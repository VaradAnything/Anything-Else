import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { ScrollHideDirective } from '../../directives/scroll-hide/home-scroll-hide';
import { IonicImageLoader } from 'ionic-image-loader';
import { TooltipsModule } from 'ionic-tooltips';


@NgModule
({
  declarations: 
  [
    HomePage,
    ScrollHideDirective
  ],
  imports: 
  [
    IonicPageModule.forChild(HomePage),
    TooltipsModule.forRoot(),
    IonicImageLoader
  ],
  schemas: 
  [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class HomePageModule {}

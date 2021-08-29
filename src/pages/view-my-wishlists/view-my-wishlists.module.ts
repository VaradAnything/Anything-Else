import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewMyWishlistsPage } from './view-my-wishlists';
import { ScrollHideDirective } from '../../directives/scroll-hide/wishlist-scroll-hide';

@NgModule
({
  declarations: 
  [
    ViewMyWishlistsPage,
    ScrollHideDirective
  ],
  imports: 
  [
    IonicPageModule.forChild(ViewMyWishlistsPage),
  ],
  schemas: 
  [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ViewMyWishlistsPageModule {}

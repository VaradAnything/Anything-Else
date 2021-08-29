import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component
({
  	selector: 'page-return',
  	templateUrl: 'return.html',
})

export class ReturnPage 
{
  	constructor(public navCtrl: NavController, public navParams: NavParams) 
  	{
  	}

  	ionViewDidLoad() 
  	{
    	console.log('ionViewDidLoad ReturnPage');
  	}

  	shopping()
  	{
      	this.navCtrl.setRoot('HomePage');
  	}
}

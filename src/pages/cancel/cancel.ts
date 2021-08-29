import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component
({
  	selector: 'page-cancel',
  	templateUrl: 'cancel.html',
})

export class CancelPage 
{
  	constructor(public navCtrl: NavController, public navParams: NavParams) 
  	{
  	}

  	ionViewDidLoad() 
  	{
    	console.log('ionViewDidLoad CancelPage');
  	}

  	shopping()
  	{
      	this.navCtrl.setRoot('HomePage');
  	}
}

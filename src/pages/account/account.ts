import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Market } from '@ionic-native/market';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrowserTab } from '@ionic-native/browser-tab';

@IonicPage()
@Component
({
	selector: 'page-account',
	templateUrl: 'account.html',
}) 

export class AccountPage 
{
	cart_items_count: number;
	constructor(public navCtrl: NavController, public navParams: NavParams,public toastCtrl: ToastController, private nativePageTransitions: NativePageTransitions, private market: Market,private iab: InAppBrowser,private browserTab: BrowserTab) 
	{
	}

	openNotification()
	{
		this.navCtrl.push('NotificationPage');
	}

	openTabsPage(type)
	{
		if(type == 1)
		{
			this.navCtrl.setRoot('HomePage');
		}
		else if(type == 2)
		{
			this.navCtrl.setRoot('ViewMainCategoriesPage');
		}
		else if(type == 3)
		{
			this.navCtrl.setRoot('ViewMyCartPage');
		}
		else if(type == 4)
		{
			//this.navCtrl.setRoot('AccountPage');
			//this.ionViewWillEnter();
		}
	}

	ionViewDidLoad() 
	{
		let elements = document.querySelectorAll(".tabbar");

		if (elements != null) 
		{
			Object.keys(elements).map((key) => 
			{
				elements[key].style.display = 'flex';
			});
		}
	}

	ionViewWillEnter()
	{
		localStorage.setItem('page_name', JSON.stringify('AccountPage'));
		let elements = document.querySelectorAll(".tabbar");

		if (elements != null) 
		{
			Object.keys(elements).map((key) => 
			{
				elements[key].style.display = 'flex';
			});
		}

		if(JSON.parse(localStorage.getItem('cart_items_count')) == '' || JSON.parse(localStorage.getItem('cart_items_count')) == null)
        {
        	localStorage.setItem('cart_items_count', JSON.stringify(0));
        	this.cart_items_count = 0;
        }
        else
        {
        	this.cart_items_count = JSON.parse(localStorage.getItem('cart_items_count'));
        }
	}

	openPage(type)
	{
		if(type == 1)
		{
			if(JSON.parse(localStorage.getItem('login_type')) == 0)
	  		{
	  			let toast = this.toastCtrl.create
		        ({
		            message: 'Please login',
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
		        this.navCtrl.setRoot('SigninPage');
	  		}
  			else
  			{
				this.navCtrl.push('ViewOrdersPage');
			}
		}
		else if(type == 2)
		{
			if(JSON.parse(localStorage.getItem('login_type')) == 0)
	  		{
	  			let toast = this.toastCtrl.create
		        ({
		            message: 'Please login',
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
		        this.navCtrl.setRoot('SigninPage');
	  		}
  			else
  			{
				this.navCtrl.push('ViewReturnsPage');
			}
		}
		else if(type == 3)
		{
			if(JSON.parse(localStorage.getItem('login_type')) == 0)
	  		{
	  			let toast = this.toastCtrl.create
		        ({
		            message: 'Please login',
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
		        this.navCtrl.setRoot('SigninPage');
	  		}
  			else
  			{
				this.navCtrl.push('ViewMyWishlistsPage');
			}
		}
		else if(type == 4)
		{
			if(JSON.parse(localStorage.getItem('login_type')) == 0)
	  		{
	  			let toast = this.toastCtrl.create
		        ({
		            message: 'Please login',
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
		        this.navCtrl.setRoot('SigninPage');
	  		}
  			else
  			{
				this.navCtrl.push('ViewAddressPage');
			}
		}
		else if(type == 5)
		{
			if(JSON.parse(localStorage.getItem('login_type')) == 0)
	  		{
	  			let toast = this.toastCtrl.create
		        ({
		            message: 'Please login',
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
		        this.navCtrl.setRoot('SigninPage');
	  		}
  			else
  			{
				this.navCtrl.push('ViewProfilePage');
			}
		}
		else if(type == 6)
		{
			if(JSON.parse(localStorage.getItem('login_type')) == 0)
	  		{
	  			let toast = this.toastCtrl.create
		        ({
		            message: 'Please login',
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
		        this.navCtrl.setRoot('SigninPage');
	  		}
  			else
  			{
				this.navCtrl.push('ChangePasswordPage');
			}
		}
		else if(type == 7)
		{
			this.market.open('com.anythingelse.mobile');
		}
		else if(type == 8)
		{
			this.browserTab.isAvailable()
	      	.then((isAvailable: boolean) =>
	      	{
	          	if (isAvailable)
	          	{
	              	this.browserTab.openUrl('https://www.anythingelse.in/about-us');
	          	}
	          	else
	          	{
	              	const browser = this.iab.create('https://www.anythingelse.in/about-us','_self',{location:'no'});
	              	browser.show();
	          	}
	      	});
			//this.navCtrl.push('AboutUsPage');
		}
		else if(type == 9)
		{
			this.browserTab.isAvailable()
	      	.then((isAvailable: boolean) =>
	      	{
	          	if (isAvailable)
	          	{
	              	this.browserTab.openUrl('https://www.anythingelse.in/faq');
	          	}
	          	else
	          	{
	              	const browser = this.iab.create('https://www.anythingelse.in/faq','_self',{location:'no'});
	              	browser.show();
	          	}
	      	});
			//this.navCtrl.push('FaqPage');
		}
		else if(type == 10)
		{
			this.navCtrl.push('ContactUsPage');
		}
	}

	ionViewWillLeave()
  	{
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'flex';
	        });
	    }
  	}
}

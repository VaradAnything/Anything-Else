import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,LoadingController,ToastController,AlertController } from 'ionic-angular';
import { Http }  from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { ModuleProvider } from '../../providers/module-service';
import { ScrollHideConfig } from '../../directives/scroll-hide/wishlist-scroll-hide';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-view-my-wishlists',
  templateUrl: 'view-my-wishlists.html',
})

export class ViewMyWishlistsPage 
{
	loadingModal: any;
  	db_result: any;
  	
	wishlists_data_array : any;
  	item_count: number;

  	footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 57 };

	constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,public moduleService: ModuleProvider,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public events: Events, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
	{
	}

	doRefresh(refresher)
	{
		setTimeout(() => 
		{
      		this.ionViewWillEnter();
      		refresher.complete();
    	}, 1000);
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

  	ionViewWillLeave()
  	{
  		this.loadingModal.dismiss();
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'none';
	        });
	    }
  	}

  	ionViewWillEnter() 
  	{
  		localStorage.setItem('page_name', JSON.stringify('ViewMyWishlistsPage'));
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'flex';
	        });
	    }

  		var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
  		this.loadingModal = this.loadingCtrl.create(
	    {
	      	spinner:'hide',
	      	content: '<img src="assets/icon/loader.gif">',
      		//dismissOnPageChange: true,
                enableBackdropDismiss: true
	    });
	    this.loadingModal.present();
	    this.moduleService.view_wishlists(mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	      		this.item_count = 1;
	        	this.wishlists_data_array = db_result.data.user_wishlist;
	        	this.loadingModal.dismiss();
	      	}
	      	else
	      	{
		        this.wishlists_data_array = '';
		        this.item_count = 0;
		        let toast = this.toastCtrl.create
		        ({
		            message: db_result.message,
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
		        this.loadingModal.dismiss();
	      	}
	    },(reson) => 
	    {
	    	/*let alert = this.alertCtrl.create
            ({
                title: 'No Internet Connection',
                subTitle: 'Please check your internet connection and try again',
                buttons: ['OK']
            });
            alert.present();*/
            let toast = this.toastCtrl.create
            ({
                message: 'No Internet Connection',
                duration: 1500,
                position: 'bottom',
            });
	                toast.present();
	      	this.loadingModal.dismiss();
	    });
    	console.log('ionViewWillEnter ViewAddressPage');
  	}

  	updateWishlist(product_seo_url,product_variant_seo_url,type)
  	{
  		var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
  		this.loadingModal = this.loadingCtrl.create(
	    {
	      	spinner:'hide',
	      	content: '<img src="assets/icon/loader.gif">',
      		//dismissOnPageChange: true,
                enableBackdropDismiss: true
	    });
	    this.loadingModal.present();
	    this.moduleService.update_wishlists(product_seo_url,product_variant_seo_url,type,mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	        	let toast = this.toastCtrl.create
		        ({
		            message: db_result.message,
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
		        this.loadingModal.dismiss();
		        this.reloadPage();
	      	}
	      	else
	      	{
		        let toast = this.toastCtrl.create
		        ({
		            message: db_result.message,
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
		        this.loadingModal.dismiss();
	      	}
	    },(reson) => 
	    {
	    	/*let alert = this.alertCtrl.create
            ({
                title: 'No Internet Connection',
                subTitle: 'Please check your internet connection and try again',
                buttons: ['OK']
            });
            alert.present();*/
            let toast = this.toastCtrl.create
            ({
                message: 'No Internet Connection',
                duration: 1500,
                position: 'bottom',
            });
            toast.present();
	      	this.loadingModal.dismiss();
	    });
  	}


  	reloadPage()
  	{
  		var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
  		/*this.loadingModal = this.loadingCtrl.create(
	    {
	      	spinner:'hide',
	      	content: '<img src="assets/icon/loader.gif">',
      		//dismissOnPageChange: true,
                enableBackdropDismiss: true
	    });
	    this.loadingModal.present();*/
	    this.moduleService.view_wishlists(mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	        	this.wishlists_data_array = db_result.data.user_wishlist;
	        	this.item_count = 1;
	      	}
	      	else
	      	{
		        this.wishlists_data_array = '';
		        this.item_count = 0;
		        let toast = this.toastCtrl.create
		        ({
		            message: db_result.message,
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
	      	}
	      	//this.loadingModal.dismiss();
	    },(reson) => 
	    {
	    	/*let alert = this.alertCtrl.create
            ({
                title: 'No Internet Connection',
                subTitle: 'Please check your internet connection and try again',
                buttons: ['OK']
            });
            alert.present();*/
            let toast = this.toastCtrl.create
            ({
                message: 'No Internet Connection',
                duration: 1500,
                position: 'bottom',
            });
            toast.present();
	      	//this.loadingModal.dismiss();
	    });
  	}

  	viewCategories()
  	{
  		//this.navCtrl.setRoot('TabsPage', { tabIndex : 1 });
  		this.navCtrl.setRoot('ViewMainCategoriesPage');
  	}

  	addToCart(product_seo_url,product_variant_seo_url,product_min_qty)
  	{
  		var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
  		this.loadingModal = this.loadingCtrl.create(
	    {
	      	spinner:'hide',
	      	content: '<img src="assets/icon/loader.gif">',
      		//dismissOnPageChange: true,
                enableBackdropDismiss: true
	    });
	    this.loadingModal.present();
	    this.moduleService.add_to_cart(product_seo_url,product_variant_seo_url,product_min_qty,mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	        	let toast = this.toastCtrl.create
		        ({
		            message: db_result.message,
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
		        if(db_result.cart_items_count == '' || db_result.cart_items_count == null)
                {
                	localStorage.setItem('cart_items_count', JSON.stringify(0));
                }
                else
                {
                	localStorage.setItem('cart_items_count', JSON.stringify(db_result.cart_items_count));
                }
		        this.events.publish('cart:updated', db_result.cart_items_count);
	      	}
	      	else
	      	{
		        let toast = this.toastCtrl.create
		        ({
		            message: db_result.message,
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
	      	}
	      	this.loadingModal.dismiss();
	    },(reson) => 
	    {
	    	/*let alert = this.alertCtrl.create
            ({
                title: 'No Internet Connection',
                subTitle: 'Please check your internet connection and try again',
                buttons: ['OK']
            });
            alert.present();*/
            let toast = this.toastCtrl.create
            ({
                message: 'No Internet Connection',
                duration: 1500,
                position: 'bottom',
            });
            toast.present();
	      	this.loadingModal.dismiss();
	    });
  	}

  	openProductDetails(product_variant_seo_url)
  	{
  		localStorage.setItem('product_variant_seo_url', JSON.stringify(product_variant_seo_url));
  		this.navCtrl.push('ViewProductDetailsPage',{ product_variant_seo_url:product_variant_seo_url });
  	}
}

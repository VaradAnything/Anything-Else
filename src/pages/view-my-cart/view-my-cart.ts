import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,LoadingController,ToastController,AlertController } from 'ionic-angular';
import { Http }  from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { ModuleProvider } from '../../providers/module-service';
import { ScrollHideConfig } from '../../directives/scroll-hide/cart-scroll-hide';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-view-my-cart',
  templateUrl: 'view-my-cart.html',
})

export class ViewMyCartPage 
{
	loadingModal: any;
  	db_result: any;
  	
	cart_data_array : any;
  	item_count: number;

  	login_type: number;
  	order_total_amount: number = 0;
  	product_variant_quantity: number = 0;
  	cart_items_count: number;

  	without_login_cart_data_array:any;

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
            //this.navCtrl.setRoot('ViewMyCartPage');
            //this.ionViewWillEnter();
        }
        else if(type == 4)
        {
            this.navCtrl.setRoot('AccountPage');
        }
    }

	openNotification()
    {
        this.navCtrl.push('NotificationPage');
    }

    openProductDetails(product_variant_seo_url)
  	{
  		localStorage.setItem('product_variant_seo_url', JSON.stringify(product_variant_seo_url));
  		this.navCtrl.push('ViewProductDetailsPage',{ product_variant_seo_url:product_variant_seo_url });
  	}

  	ionViewWillEnter()
  	{
  		localStorage.setItem('page_name', JSON.stringify('ViewMyCartPage'));
  		this.login_type = JSON.parse(localStorage.getItem('login_type'));
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'flex';
	        });
	    }

	    this.cart_items_count = JSON.parse(localStorage.getItem('cart_items_count'));
	    if(JSON.parse(localStorage.getItem('login_type')) == 0)
  		{
  			var without_login_cart = JSON.parse(localStorage.getItem('without_login_cart_data_array'));
  			this.without_login_cart_data_array = without_login_cart;
	      	var temp_total_price = 0;

	      	if(this.without_login_cart_data_array == '' || this.without_login_cart_data_array == null)
			{
		      	this.order_total_amount = 0;
		      	this.item_count = 0;
		      	this.cart_data_array = '';
	      	}
	      	else
	      	{
	      		this.item_count = 1;
	      		this.cart_data_array = this.without_login_cart_data_array;
	      		var temp_total_qty = 0;
	      		for (var v in this.without_login_cart_data_array) 
		      	{
			        var cart_data = this.without_login_cart_data_array[v];
			        var item_price = (+cart_data.product_variant_price) * (+cart_data.product_variant_quantity);
			        temp_total_price = (+temp_total_price) + (+item_price);
			        temp_total_qty = (+temp_total_qty) + (+cart_data.product_variant_quantity);
		      	}
		      	this.order_total_amount = Math.round(temp_total_price * 100) / 100;
		      	localStorage.setItem('total_cart', JSON.stringify(temp_total_qty));
	      	}

	      	var temp_total_qty = 0;
	  		for (var v in this.without_login_cart_data_array) 
	      	{
	      		var cart_data = this.without_login_cart_data_array[v];
		        temp_total_qty = (+temp_total_qty) + 1;
	      	}
	      	this.cart_items_count = +(temp_total_qty);
	      	localStorage.setItem('cart_items_count', JSON.stringify(temp_total_qty));
  		}
  		else
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
		    this.moduleService.view_cart(mobile_access_token).then((db_result: any) => 
		    {
		      	this.db_result = db_result;
		      	if(db_result.status_code == 200)
		      	{ 
		      		this.item_count = 1;
		        	this.cart_data_array = db_result.data.cart;
		        	this.order_total_amount = db_result.order_total_amount;
		        	this.product_variant_quantity = db_result.product_variant_quantity;
	                if(db_result.cart_items_count == '' || db_result.cart_items_count == null)
	                {
	                    localStorage.setItem('cart_items_count', JSON.stringify(0));
	                    this.cart_items_count = 0;
	                }
	                else
	                {
	                    localStorage.setItem('cart_items_count', JSON.stringify(db_result.cart_items_count));
	                    this.cart_items_count = db_result.cart_items_count;
	                }

		        	this.events.publish('cart:updated', db_result.cart_items_count);
		        	this.loadingModal.dismiss();
		      	}
		      	else
		      	{
			        this.cart_data_array = '';
			        this.item_count = 0;
			        this.order_total_amount = 0;
			        this.product_variant_quantity = 1;
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

  	addToCart(product_seo_url,product_variant_seo_url)
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
	    this.moduleService.add_to_cart(product_seo_url,product_variant_seo_url,1,mobile_access_token).then((db_result: any) => 
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
		        this.cart_items_count = db_result.cart_items_count;
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

  	removeFromCart(product_seo_url,product_variant_seo_url)
  	{
    	if(JSON.parse(localStorage.getItem('login_type')) == 0)
  		{
  			var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));
		    for (var v in without_login_cart_data_array) 
		    {
		      	if(product_variant_seo_url == without_login_cart_data_array[v]['product_variant_seo_url'])
		      	{
			        without_login_cart_data_array.splice(v, 1);
			        localStorage.removeItem('without_login_cart_data_array');
			        localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
			        let toast = this.toastCtrl.create
			        ({
			            message: 'Product Removed From Cart Successfully',
			            duration: 1500,
			            position: 'bottom',
			        });
			        toast.present();
			        this.ionViewWillEnter();
			        break;
		      	}
		    }
  		}
  		else
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
		    this.moduleService.remove_from_cart(product_seo_url,product_variant_seo_url,mobile_access_token).then((db_result: any) => 
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
  	}

  	updateToCart(position,product_seo_url,product_variant_seo_url,product_variant_quantity,action)
  	{
  		if(JSON.parse(localStorage.getItem('login_type')) == 0)
    	{
    		let toast = this.toastCtrl.create
	        ({
	            message: 'Please Login For Update Cart',
	            duration: 1500,
	            position: 'bottom',
	        });
	        toast.present();
    	}
    	else
    	{
    		if(product_variant_quantity <= 1 && action == 0)
	  		{
	  			let toast = this.toastCtrl.create
		        ({
		            message: 'Quantity should not be zero',
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
	  		}
		    else
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
			    this.moduleService.update_to_cart(product_seo_url,product_variant_seo_url,action,mobile_access_token).then((db_result: any) => 
			    {
			      	this.db_result = db_result;
			      	if(db_result.status_code == 200)
			      	{ 
			        	/*let toast = this.toastCtrl.create
				        ({
				            message: db_result.message,
				            duration: 1500,
				            position: 'bottom',
				        });
				        toast.present();*/

				        if(JSON.parse(localStorage.getItem('login_type')) == 0)
			  			{
							for (var v in this.without_login_cart_data_array) 
			                {
			                  	var cart_data = this.without_login_cart_data_array[v];
			                  	var temp_product_variant_seo_url = cart_data.product_variant_seo_url;
			                  	if(product_variant_seo_url == temp_product_variant_seo_url)
			                  	{
			                  		if(action == 1)
			                  		{
			                  			if(db_result.total_available_quantity > cart_data['product_variant_quantity'])
				      					{ 	
				      						cart_data['product_variant_quantity'] = (+cart_data.product_variant_quantity) + 1;
				      					}
				      					else
				      					{
				      						let toast = this.toastCtrl.create
						                    ({
						                        message: 'No more stock available',
						                        duration: 1500,
						                        position: 'bottom',
						                    });
						                    toast.present();
				      					}
			                  		}
			                    	else
			                    	{
			                    		if(cart_data['product_variant_quantity'] > 1)
				      					{ 	
				      						cart_data['product_variant_quantity'] = (+cart_data.product_variant_quantity) - 1;
				      					}
			                    	}
			                    	break;
			                  	}
			                }
			                localStorage.setItem('without_login_cart_data_array', JSON.stringify(this.without_login_cart_data_array));
			                this.ionViewWillEnter();
			  			}
			  			else
			  			{
					        this.order_total_amount = db_result.total_cart_amount;
				        	this.cart_data_array[position]['product_variant_quantity'] = db_result.updated_product_qty;
				        	this.cart_items_count = db_result.cart_items_count;
				        	this.events.publish('cart:updated', db_result.cart_items_count);
				        }
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
    	}
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
	    this.moduleService.view_cart(mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	        	this.cart_data_array = db_result.data.cart;
	        	this.order_total_amount = db_result.order_total_amount;
	        	this.product_variant_quantity = db_result.product_variant_quantity;
                if(db_result.cart_items_count == '' || db_result.cart_items_count == null)
                {
                    localStorage.setItem('cart_items_count', JSON.stringify(0));
                    this.cart_items_count = 0;
                }
                else
                {
                    localStorage.setItem('cart_items_count', JSON.stringify(db_result.cart_items_count));
                    this.cart_items_count = db_result.cart_items_count;
                }

	        	this.events.publish('cart:updated', db_result.cart_items_count);
	        	this.item_count = 1;
	      	}
	      	else
	      	{
		        this.cart_data_array = '';
		        this.item_count = 0;
		        this.order_total_amount = 0;
		        this.product_variant_quantity = 1;
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

  	placeOrder()
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
  			this.navCtrl.push('ViewCheckoutPage');
  		}
  	}
}

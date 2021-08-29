import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController,ToastController, App,AlertController } from 'ionic-angular';
import { Http }  from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ModuleProvider } from '../../providers/module-service';
import { Events } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ScrollHideConfig } from '../../directives/scroll-hide/product-details-scroll-hide';

import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component
({
  selector: 'page-view-product-details',
  templateUrl: 'view-product-details.html',
})

export class ViewProductDetailsPage 
{
	loadingModal: any;
  	db_result: any;

  	moduleForm: FormGroup;
  	submitAttempt: boolean = false;

  	play_animation : number = 0;

	product_data_array : any;
	variant_group_data_array : any;
	specification_data_array : any;
	reviews_data_array : any;
  	item_count: number;
  	my_wishlist_count: number = 0;
  	total_items_in_cart: number = 0;
  	is_wishlisted: number = 0;
  	in_stock: number = 0;
  	total_review_star: number = 0;
  	is_show_review: number = 0;
  	product_description_type: string = '1';
  	is_show_details: number = 1;
  	login_type: number = 0;
  	is_footer_show: number = 0;
  	discount_percent: string = '0';

  	product_short_description: string = '';
  	key_feature_1: string = '';
  	key_feature_2: string = '';
  	key_feature_3: string = '';
  	product_seo_url: string = '';
  	product_variant_seo_url: string = '';
  	temp_product_data: any;

  	min_qty: string = '';
  	product_min_qty: number = 0;
  	is_returnable: number = 0;
  	discount_save: string = '';

  	product_id: string = '';
  	product_variant_id: string = '';
  	mobile_access_token: string = '';

  	public cssTempReviewStarClass1 : string;
    public cssTempReviewStarClass2 : string;
    public cssTempReviewStarClass3 : string;
    public cssTempReviewStarClass4 : string;
    public cssTempReviewStarClass5 : string;

    public cssClass1 : string = '';

    footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 57 };

	constructor(public navCtrl: NavController, public navParams: NavParams,public moduleService: ModuleProvider,public loadingCtrl: LoadingController,public toastCtrl: ToastController, private nativePageTransitions: NativePageTransitions,public _app: App,public formBuilder: FormBuilder,public http:Http,public events: Events,private photoViewer: PhotoViewer,public alertCtrl: AlertController,private socialSharing: SocialSharing) 
	{
		this.navCtrl= navCtrl;
	    this.http = http;
	    this.moduleForm = formBuilder.group
	    ({
	      	review_title: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(50)])],
	      	review_comment: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(100)])],
	      	//rating: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(5),  Validators.required])]
	    });

		//this.product_variant_seo_url = this.navParams.get('product_variant_seo_url');
	}

	showDetails(type)
	{
		this.is_show_details = type;
	}

	doRefresh(refresher)
	{
		setTimeout(() => 
		{
      		this.ionViewWillEnter();
      		refresher.complete();
    	}, 1000);
	}

  	ionViewWillEnter()
  	{
  		this.login_type = +(JSON.parse(localStorage.getItem('login_type')));
  		this.mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
  		this.play_animation = JSON.parse(localStorage.getItem('play_animation'));
  	  	if(this.play_animation == null || this.play_animation == 1)
  	  	{
  	  		this.play_animation = 0;
  	  	}

  		localStorage.setItem('page_name', JSON.stringify('ViewProductDetailsPage'));
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'none';
	        });
	    }

	    this.product_variant_seo_url = JSON.parse(localStorage.getItem('product_variant_seo_url'));

	    this.cssTempReviewStarClass1 = "cssReviewStarClass2";
		this.cssTempReviewStarClass2 = "cssReviewStarClass2";
		this.cssTempReviewStarClass3 = "cssReviewStarClass2";
		this.cssTempReviewStarClass4 = "cssReviewStarClass2";
		this.cssTempReviewStarClass5 = "cssReviewStarClass2";

  		var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
  		this.loadingModal = this.loadingCtrl.create(
	    {
	      	spinner:'hide',
	      	content: '<img src="assets/icon/loader.gif">',
      		//dismissOnPageChange: true,
                enableBackdropDismiss: true
	    });
	    this.loadingModal.present();
	    this.moduleService.view_product_details(this.product_variant_seo_url,mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
  				this.is_footer_show = 1;
	      		this.item_count = 1;
	      		this.temp_product_data = db_result.data.product[0];
	      		this.cssClass1 = "animated fadeInUp";
	        	this.product_data_array = db_result.data.product;
	        	this.min_qty = db_result.data.product[0].min_qty;
	        	this.product_min_qty = +db_result.data.product[0].product_min_qty;
	        	this.product_id = db_result.data.product[0].id;
	        	this.product_variant_id = db_result.data.product[0].product_variant_id;
	        	this.is_returnable = db_result.data.product[0].is_returnable;
	        	this.discount_save = db_result.data.product[0].discount_save;
	        	this.is_wishlisted = db_result.data.product[0].is_wishlisted;
	        	this.discount_percent = db_result.data.product[0].discount_percent;
	        	this.product_seo_url = db_result.data.product[0].product_seo_url;
	        	this.product_variant_seo_url = db_result.data.product[0].product_variant_seo_url;
	        	this.in_stock = db_result.data.product[0].in_stock;
	        	this.variant_group_data_array = db_result.data.product[0].variant_group[0];
	        	this.total_items_in_cart = db_result.cart_items_count;
	        	this.my_wishlist_count = db_result.wishlist_items_count;
	        	this.events.publish('cart:updated', db_result.cart_items_count);
	        	if(db_result.cart_items_count == '' || db_result.cart_items_count == null)
                {
			      	if(JSON.parse(localStorage.getItem('login_type')) == 0)
                    {
                    	var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

				  		var temp_total_qty = 0;
				  		for (var v in without_login_cart_data_array) 
				      	{
				      		var cart_data = without_login_cart_data_array[v];
					        temp_total_qty = (+temp_total_qty) + 1;
				      	}

				      	if(without_login_cart_data_array == '' || without_login_cart_data_array == null)
			            {
					    }
					    else
					    {
					    	this.total_items_in_cart = +(temp_total_qty);
					      	localStorage.setItem('cart_items_count', JSON.stringify(temp_total_qty));
					    }
                    }
                    else
                    {
                        localStorage.setItem('cart_items_count', JSON.stringify(0));
                        this.total_items_in_cart = 0;
                    }
                }
                else
                {
                	localStorage.setItem('cart_items_count', JSON.stringify(db_result.cart_items_count));
                	this.total_items_in_cart = db_result.cart_items_count;
                }
	        	

	        	this.product_short_description = db_result.data.product[0].product_short_description;
	        	this.key_feature_1 = db_result.data.product[0].key_feature_1;
	        	this.key_feature_2 = db_result.data.product[0].key_feature_2;
	        	this.key_feature_3 = db_result.data.product[0].key_feature_3;

	        	this.specification_data_array = db_result.data.product[0].specification;
	        	this.reviews_data_array = db_result.data.product[0].reviews;
	        	if(this.product_short_description == '')
	        	{
		        	if(this.specification_data_array != '')
		        	{
		        		this.product_description_type = '2';
		        	}
		        	else
		        	{
	        			this.product_description_type = '3';
	        		}
	        	}
	        	else
	        	{
	        		this.product_description_type = '1';
	        	}
	        	
	        	this.loadingModal.dismiss();
	      	}
	      	else
	      	{
	      		this.is_footer_show = 0;
		        this.min_qty = ''; 
		        this.product_min_qty = 0;
		        this.is_returnable = 0;
	        	this.discount_save = '';
		        this.temp_product_data = '';
		        this.product_data_array = '';
		        this.variant_group_data_array = '';
		        this.discount_percent = '0';
		        this.item_count = 0;
		        this.total_items_in_cart = 0;
		        this.my_wishlist_count = 0;
		        this.is_wishlisted = 0;
		        this.in_stock = 0;
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

  	ionViewWillLeave()
  	{
  		this.loadingModal.dismiss();
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'flex';
	        });
	    }
  	}

  	zoomImage(image_path)
  	{
  		var options = 
  		{
		    share: true, // default is false
		    closeButton: true, // default is true
		    copyToReference: true // default is false
		};
  		this.photoViewer.show(image_path,'Anythingelse',options);
  	}
  	

  	ionViewDidLoad() 
  	{
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'none';
	        });
	    }
  	}

  	openProductDetails(product_variant_seo_url)
  	{
  		localStorage.setItem('product_variant_seo_url', JSON.stringify(product_variant_seo_url));
  		this.ionViewWillEnter();
  		/*this.navCtrl.pop();
  		this.navCtrl.push('ViewProductDetailsPage',{ product_variant_seo_url:product_variant_seo_url });*/
  		/*let options: NativeTransitionOptions = 
  		{
        	duration: 700
      	};
      	this.nativePageTransitions.fade(options);
      	this.navCtrl.pop();
  		this.nativePageTransitions.fade(null);
    	this.navCtrl.push('ViewProductDetailsPage',{ product_variant_seo_url:product_variant_seo_url });*/
  	}

  	addToCart(cart_type)
  	{
  		if(JSON.parse(localStorage.getItem('login_type')) == 0)
    	{
    		let toast = this.toastCtrl.create
	        ({
	            message: 'Please Login For Add To Cart',
	            duration: 1500,
	            position: 'bottom',
	        });
	        toast.present();
    	}
    	else
    	{
    		var add_to_cart_qty = 1;
	  		if(this.product_min_qty == 0)
	  		{	
	  			add_to_cart_qty = +1;
	  		}
	  		else
	  		{
	  			add_to_cart_qty = +this.product_min_qty;
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
		    this.moduleService.add_to_cart(this.product_seo_url,this.product_variant_seo_url,add_to_cart_qty,mobile_access_token).then((db_result: any) => 
		    {
		      	this.db_result = db_result;
		      	if(db_result.status_code == 200)
		      	{ 
		      		if(JSON.parse(localStorage.getItem('login_type')) == 0)
				  	{
				  		if(db_result.total_available_quantity >= add_to_cart_qty)
				  		{
				  			var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));
				  			var temp_product_details = this.product_data_array[0];

					  		if(without_login_cart_data_array == '' || without_login_cart_data_array == null)
				            {
						  		without_login_cart_data_array.push
					            ({
					            	product_id:  temp_product_details.id,
					            	category_id:  temp_product_details.category_id,
					            	product_variant_id:  temp_product_details.product_variant_id,
					                product_image:  temp_product_details.photo1_size_medium,
					                product_name : temp_product_details.product_name,
					                product_seo_url:  temp_product_details.product_seo_url,
					                product_variant_seo_url : temp_product_details.product_variant_seo_url,
					                product_variant_mrp : temp_product_details.product_mrp,
					                product_variant_price:  temp_product_details.product_price,
					                product_variant_quantity:  add_to_cart_qty,
					                product_variant_one : '',
					                product_variant_two : '',
					            });
					            localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
					            let toast = this.toastCtrl.create
					            ({
					                message: 'Product added to cart successfully',
					                duration: 1500,
					                position: 'bottom',
					            });
					            toast.present();
					            if(cart_type == 2)
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
					        }
					        else
					        {
					        	var type = 0;
				              	for (var v in without_login_cart_data_array) 
				              	{
					                var without_login_cart_data = without_login_cart_data_array[v];
					                var product_variant_seo_url = without_login_cart_data.product_variant_seo_url;
					                if(product_variant_seo_url == this.product_variant_seo_url)
					                {
					                  	var temp_total_qty = +without_login_cart_data.product_variant_quantity;
					                  	if(temp_total_qty < db_result.total_available_quantity)
					                  	{
					                      	without_login_cart_data['product_variant_quantity'] = (+temp_total_qty) + 1;
					                      	localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
					                      	//this.navCtrl.setRoot('TabsPage', { tabIndex:1}); 
					                      	let toast = this.toastCtrl.create
					                      	({
					                          	message: 'Product updated to cart successfully',
					                          	duration: 1500,
					                          	position: 'bottom',
					                      	});
					                      	toast.present();
					                      	type = 1;
					                      	if(cart_type == 2)
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
					                      	break;
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
						                    //this.navCtrl.setRoot('SigninPage');
						                    type = 1;
						                    break;
					                  	}
					                }
				              	}
				              	if(type == 0)
				              	{
				                  	if(db_result.total_available_quantity >= add_to_cart_qty)
				                  	{
					                    var temp_product_details = this.product_data_array[0];
					                    without_login_cart_data_array.push
					                    ({
					                    	product_id:  temp_product_details.id,
							            	category_id:  temp_product_details.category_id,
							            	product_variant_id:  temp_product_details.product_variant_id,
					                        product_image:  temp_product_details.photo1_size_medium,
							                product_name : temp_product_details.product_name,
							                product_seo_url:  temp_product_details.product_seo_url,
							                product_variant_seo_url : temp_product_details.product_variant_seo_url,
							                product_variant_mrp : temp_product_details.product_mrp,
							                product_variant_price:  temp_product_details.product_price,
							                product_variant_quantity:  add_to_cart_qty,
							                product_variant_one : '',
							                product_variant_two : '',
					                    });
					                    localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
					                    //this.navCtrl.setRoot('TabsPage', { tabIndex:1}); 
					                    let toast = this.toastCtrl.create
					                    ({
					                        message: 'Product added to cart successfully.',
					                        duration: 1500,
					                        position: 'bottom',
					                    });
					                    toast.present();
					                    if(cart_type == 2)
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
				                  	}
				              	}
					        }
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

				  		var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

				  		var temp_total_qty = 0;
				  		for (var v in without_login_cart_data_array) 
				      	{
				      		var cart_data = without_login_cart_data_array[v];
					        temp_total_qty = (+temp_total_qty) + 1;
				      	}
				      	this.total_items_in_cart = +(temp_total_qty);
				      	localStorage.setItem('cart_items_count', JSON.stringify(temp_total_qty));
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
				        if(db_result.cart_items_count == '' || db_result.cart_items_count == null)
		                {
		                	localStorage.setItem('cart_items_count', JSON.stringify(0));
		                	this.total_items_in_cart = 0;
		                }
		                else
		                {
		                	localStorage.setItem('cart_items_count', JSON.stringify(db_result.cart_items_count));
		                	this.total_items_in_cart = db_result.cart_items_count;
		                }
				        this.events.publish('cart:updated', db_result.cart_items_count);
				        if(cart_type == 2)
				        {
				        	this.navCtrl.push('ViewCheckoutPage');
				        }
				        localStorage.setItem('play_animation', JSON.stringify(1));
		    			this.play_animation = JSON.parse(localStorage.getItem('play_animation'));
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

  	updateWishlist(is_wishlisted)
  	{
  		if(JSON.parse(localStorage.getItem('login_type')) == 0)
  		{
  			let toast = this.toastCtrl.create
	        ({
	            message: 'Please login to add product in wishlist',
	            duration: 1500,
	            position: 'bottom',
	        });
	        toast.present();
	        this.navCtrl.setRoot('SigninPage');
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
		    this.moduleService.update_wishlists(this.product_seo_url,this.product_variant_seo_url,1,mobile_access_token).then((db_result: any) => 
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
			        this.my_wishlist_count = db_result.my_wishlist_count;
			        if(is_wishlisted == 0)
			        {
			        	this.product_data_array[0]['is_wishlisted'] = 1;
			        	this.is_wishlisted = 1;
			        }
			        else
			        {
			        	this.product_data_array[0]['is_wishlisted'] = 0;
			        	this.is_wishlisted = 0;
			        }
	 		        //this.ionViewWillEnter();
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

  	myWishlist()
  	{
  		if(JSON.parse(localStorage.getItem('login_type')) == 0)
  		{
  			let toast = this.toastCtrl.create
	        ({
	            message: 'Please login to view MyWishlist',
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

  	myCart()
  	{
  		//this.navCtrl.setRoot('TabsPage', { tabIndex : 2 });
  		this.navCtrl.setRoot('ViewMyCartPage'); 
  	}

  	getStar(total_star)
  	{
  		this.total_review_star = total_star;
  		if(total_star == 1)
  		{
  			this.cssTempReviewStarClass1 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass2 = "cssReviewStarClass2";
  			this.cssTempReviewStarClass3 = "cssReviewStarClass2";
  			this.cssTempReviewStarClass4 = "cssReviewStarClass2";
  			this.cssTempReviewStarClass5 = "cssReviewStarClass2";
  		}
  		else if(total_star == 2)
  		{
  			this.cssTempReviewStarClass1 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass2 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass3 = "cssReviewStarClass2";
  			this.cssTempReviewStarClass4 = "cssReviewStarClass2";
  			this.cssTempReviewStarClass5 = "cssReviewStarClass2";
  		}
  		else if(total_star == 3)
  		{
  			this.cssTempReviewStarClass1 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass2 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass3 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass4 = "cssReviewStarClass2";
  			this.cssTempReviewStarClass5 = "cssReviewStarClass2";
  		}
  		else if(total_star == 4)
  		{
  			this.cssTempReviewStarClass1 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass2 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass3 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass4 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass5 = "cssReviewStarClass2";
  		}
  		else if(total_star == 5)
  		{
  			this.cssTempReviewStarClass1 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass2 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass3 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass4 = "cssReviewStarClass1";
  			this.cssTempReviewStarClass5 = "cssReviewStarClass1";
  		}
  	}

  	reloadPage()
  	{
  		this.ionViewWillEnter();
  	}

  	viewReviews(type)
  	{
  		this.is_show_review = type;
  	}

  	eventHandler(keyCode,data)
  	{
	    if(keyCode == 13)
	    {
	      this.addReview();
	    }
  	}

  	addReview()
  	{
  		this.submitAttempt = true;

    	if(!this.moduleForm.valid)
    	{ 
      		
    	} 
    	else 
    	{
    		if(this.moduleForm.value.review_title != '' && this.moduleForm.value.review_comment != '' && this.total_review_star != 0)
    		{
	    		var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
				this.loadingModal = this.loadingCtrl.create
	      		({ 
	        		spinner:'hide',
	        		content: '<img src="assets/icon/loader.gif">',
	      			//dismissOnPageChange: true,
	                enableBackdropDismiss: true
	      		});
	      		this.loadingModal.present();

	      		let form_data = 
	      		{
	        		'review_title': this.moduleForm.value.review_title,'review_comment': this.moduleForm.value.review_comment,'rating': this.total_review_star,'product_seo_url': this.product_seo_url,'product_variant_id': this.product_variant_id,'mobile_access_token': mobile_access_token
	      		};
	      		this.moduleService.add_review('', { form_data }).then((data: any) => 
	      		{
			        if(data) 
			        {
			            this.loadingModal.dismiss();
			            if(data.status_code == 200)
			            {
			              	let toast = this.toastCtrl.create
			              	({
			                  	message: data.message,
			                  	duration: 1500,
			                  	position: 'bottom',
			              	});
			              	toast.present();
			              	this.moduleForm.value.review_title = '';
			              	this.moduleForm.value.review_comment = '';
			              	this.submitAttempt = false;
	          				this.moduleForm.reset();
			              	this.ionViewWillEnter();
			            }
			            else
			            {
			              	let toast = this.toastCtrl.create
			              	({
			                  	message: data.message,
			                  	duration: 1500,
			                  	position: 'top'
			              	});
			              	toast.present();  
			            }     
			        }
	      		}, 
	      		(reson) => 
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
    		else
    		{
    			if(this.moduleForm.value.review_title == '')
    			{
    				let toast = this.toastCtrl.create
	              	({
	                  	message: 'Please Enter Review Title',
	                  	duration: 1500,
	                  	position: 'bottom',
	              	});
	              	toast.present();
    			}
    			else if(this.moduleForm.value.review_comment == '')
    			{
    				let toast = this.toastCtrl.create
	              	({
	                  	message: 'Please Enter Review Comment',
	                  	duration: 1500,
	                  	position: 'bottom',
	              	});
	              	toast.present();
    			}
    			else
    			{
    				let toast = this.toastCtrl.create
	              	({
	                  	message: 'Please Select Rating',
	                  	duration: 1500,
	                  	position: 'bottom',
	              	});
	              	toast.present();
    			}
    		}
    	}
  	}

  	buyNow()
  	{
  		if(JSON.parse(localStorage.getItem('login_type')) == 0)
    	{
    		let toast = this.toastCtrl.create
	        ({
	            message: 'Please Login For Buy Now',
	            duration: 1500,
	            position: 'bottom',
	        });
	        toast.present();
    	}
    	else
    	{
    		this.addToCart(2);
    	}
  	}

  	onFocus($event)
    {
      	this.is_footer_show = 0;
    }

    onBlur($event)
    {
      	this.is_footer_show = 1;
    }

    notify()
    {
    	if(JSON.parse(localStorage.getItem('login_type')) == 0)
    	{
    		let toast = this.toastCtrl.create
	        ({
	            message: 'Please Login For Notify',
	            duration: 1500,
	            position: 'bottom',
	        });
	        toast.present();
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
		    this.moduleService.notify(mobile_access_token,this.product_id,this.product_variant_id).then((db_result: any) => 
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
		        	this.ionViewWillEnter();
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
    }

    twitterShare(product_name,product_url) 
	{
	    // Either URL or Image
	    this.socialSharing.shareViaTwitter(null, null, product_url).then(() => 
	    {
	      	// Success
	      	console.log("Success");
	    }).catch((e) => 
	    {
	      	// Error!
	      	console.log("Error");
	    });
  	}
 
  	whatsappShare(product_name,product_url) 
  	{
   		// Text + Image or URL works
    	this.socialSharing.shareViaWhatsApp(product_name, null, product_url).then(() => 
    	{
      		// Success
	      	console.log("Success");
    	}).catch((e) => 
    	{
      		// Error!
	      	console.log("Error");
    	});
  	}
 
  	/*shareEmail(product_name,product_url) 
  	{
    	this.socialSharing.shareViaEmail(product_name, 'Product Share', ['saimon@devdactic.com'], null, null, product_url).then(() => 
    	{
      		// Success
	      	console.log("Success");
    	}).catch((e) => 
    	{
      		// Error!
	      	console.log("Error");
    	});
  	}*/
 
  	facebookShare(product_name,product_url) 
  	{
    	// Image or URL works
    	this.socialSharing.shareViaFacebook(null, product_url, null).then(() => 
    	{
      		// Success
	      	console.log("Success");
    	}).catch((e) => 
    	{
      		// Error!
	      	console.log("Error");
    	});
  	}

  	otherShare(product_name,product_url)
  	{
    	this.socialSharing.share(product_name, null,  product_url)
    	.then(
      	()=>
      	{
        	// Success
	      	console.log("Success");
      	},
      	()=>
      	{
        	// Error!
	      	console.log("Error");
      	})
  	}

  	addToCartWithoutLogin(type)
  	{
	  	if(type == 1)
	  	{
	  		let toast = this.toastCtrl.create
	        ({
	            message: 'Please Login For Add To Cart',
	            duration: 1500,
	            position: 'bottom',
	        });
	        toast.present();
	  	}
  		if(type == 2)
	  	{
	  		let toast = this.toastCtrl.create
	        ({
	            message: 'Please Login For Buy Now',
	            duration: 1500,
	            position: 'bottom',
	        });
	        toast.present();
	  	}
  	}
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform,IonicPage, NavController, NavParams,LoadingController,ToastController,AlertController,ModalController } from 'ionic-angular';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http }  from '@angular/http';
import { ModuleProvider } from '../../providers/module-service';
import { InAppBrowser,InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { BrowserTab } from '@ionic-native/browser-tab';
import { ScrollHideConfig } from '../../directives/scroll-hide/checkout-scroll-hide';

declare var cordova: any;
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-view-checkout',
  templateUrl: 'view-checkout.html',
})

export class ViewCheckoutPage 
{
	loadingModal: any;
  	db_result: any;
  	
	moduleForm: FormGroup;
  	submitAttempt: boolean = false;

  	cart_data_array : any;
  	address_data_array : any;
  	country_data_array : any;
  	state_data_array : any;
  	city_data_array : any;
  	days_data_array : any;
  	slot_data_array : any;

  	sub_total_amount : string = '0';
  	coupon_code_discount : string = '0';
  	shipping_amount : string = '0';
  	coupon_code : string = '';
  	payment_method : string = '';
  	total_amount : string = '0';
  	is_coupon_apply : number = 0;
  	is_footer_show : number = 0;


  	item_count: number;
  	address_count: number = 0;
  	//sub_total: string = '0';
  	//coupon_discount: string = '0';
  	//shipping_charges: string = '0';
  	//total_amount: string = '0';
  	//coupon_code: string = '0';
  	//is_coupon_applied: number = 0;

  	disable_applied_coupon_code: boolean = false;

  	show_add_address: number = 0;
  	//country_id : string = '101';
  	//state_id : string = '';
  	//city_id : string = '';
  	//is_city_show : number = 0;
  	address_id : string = '';

  	payment_method_type : string = '2';
  	payment_id : string = '';

  	slot_date : string = '';
  	days_title : string = '';
  	slot_id : string = '';

  	user_name : string = '';
  	email : string = '';
  	mobile : string = '';

  	inAppBrowserRef: any;

  	country_id : string = '';
  	country_name : string = 'Select Country';
  	state_id : string = '';
  	state_name : string = 'Select State';
  	city_id : string = '';
  	city_name : string = 'Select City';

    is_state_show : number =  0;
    is_city_show : number =  0;

    is_wallet_apply : string =  '0';
    wallet_amount : string =  '0';
    user_wallet_remaining_amount : string =  '0';

    checkout_unique_key : string =  '';

  	footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 57 };

  	constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController,private iab: InAppBrowser,private browserTab: BrowserTab,public platform: Platform, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController,public modalCtrl: ModalController) 
	{
	    this.navCtrl= navCtrl;
	    this.http = http;
	    this.moduleForm = formBuilder.group
	    ({
	      	first_name: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(30),  Validators.required])],
	      	last_name: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(30),  Validators.required])],
	      	company: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(50)])],
	      	mobile: ['', Validators.compose([Validators.minLength(10),Validators.maxLength(10),  Validators.required])],
	      	address1: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(200),  Validators.required])],
	      	address2: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(200)])],
	      	pincode: ['', Validators.compose([Validators.minLength(6),Validators.maxLength(6),  Validators.required])]
	    });
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
	            elements[key].style.display = 'none';
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
	            elements[key].style.display = 'flex';
	        });
	    }
  	}

	ionViewWillEnter() 
  	{
  		this.user_name = JSON.parse(localStorage.getItem('user_name'));
  		this.email = JSON.parse(localStorage.getItem('email'));
  		this.mobile = JSON.parse(localStorage.getItem('mobile'));

  		localStorage.setItem('page_name', JSON.stringify('ViewCheckoutPage'));
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'none';
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
	    this.moduleService.view_checkout_data(mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	      		this.item_count = 1;
	        	this.cart_data_array = db_result.data.cart;
	        	this.is_footer_show = 1;
	        	this.address_count = db_result.address_count;
	        	//if(db_result.data.address == '')
	        	if(db_result.address_count == 0)
	        	{
	        		this.show_add_address = 1;
	        		this.address_data_array = '';
	        		this.getState();
	        	}
	        	else
	        	{
	        		this.address_data_array = db_result.data.address;
	        		for (var v in this.address_data_array) 
			      	{
				        var address_data = this.address_data_array[v];
				        this.address_id = address_data.id;
				        break;
			      	}
	        	}
		        //this.sub_total = db_result.sub_total_amount;
		        //this.coupon_discount = db_result.coupon_discount;
		        //this.shipping_charges = db_result.shipping_charges;
		        //this.total_amount = db_result.order_total_amount;

		        this.sub_total_amount = db_result.sub_total_amount;
	        	this.coupon_code_discount = db_result.coupon_discount;
	        	this.is_coupon_apply = db_result.is_coupon_apply;
	        	this.shipping_amount = db_result.shipping_charges;
	        	this.coupon_code = db_result.coupon_code;
	        	this.payment_method = 'COD';
	        	this.total_amount = db_result.order_total_amount;
	        	this.days_data_array = db_result.days_array;
	        	//this.checkout_unique_key = db_result.checkout_unique_key;
	        	this.is_wallet_apply = db_result.is_wallet_apply;
	        	this.wallet_amount = db_result.wallet_amount;
	        	this.user_wallet_remaining_amount = db_result.user_wallet_remaining_amount;

	        	if(db_result.is_coupon_apply == 0)
	        	{
	        		this.disable_applied_coupon_code = false;
	        		this.coupon_code = '';
	        	}
	        	else
	        	{
	        		this.disable_applied_coupon_code = true;
	        		this.coupon_code = db_result.coupon_code;
	        	}
	        	this.is_coupon_apply = db_result.is_coupon_apply;
	        	this.loadingModal.dismiss();
	      	}
	      	else
	      	{
	        	this.cart_data_array = '';
	        	this.address_data_array = '';
	        	this.item_count = 0;
	        	this.is_footer_show = 0;
	        	this.days_data_array = '';
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
    	console.log('ionViewWillEnter ViewCheckoutPage');
  	}

  	getCountry()
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
	    this.moduleService.view_country_data(mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{
	        	this.country_data_array = db_result.data.country;
	        	this.getState();
	      	}
	      	else
	      	{
	        	this.country_data_array = '';
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

  	getState()
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
	    this.moduleService.view_state_data(this.country_id,mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{
	        	this.state_data_array = db_result.data.state;
	      	}
	      	else
	      	{
	        	this.state_data_array = '';
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

  	getCity($event)
  	{
  		this.state_id = $event;
  		var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
  		/*this.loadingModal = this.loadingCtrl.create(
	    {
	      	spinner:'hide',
      		content: '<img src="assets/icon/loader.gif">',
      		//dismissOnPageChange: true,
                enableBackdropDismiss: true
	    });
	    this.loadingModal.present();*/
	    this.moduleService.view_city_data(this.country_id,this.state_id,mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{
	      		this.is_city_show = 1;
	      		this.city_id = '';
	        	this.city_data_array = db_result.data.city;
	      	}
	      	else
	      	{
	      		this.is_city_show = 0;
	        	this.city_data_array = '';
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

  	getCityId($event)
  	{
  		this.city_id = $event;
  	}

  	eventHandler(keyCode,data)
  	{
	    if(keyCode == 13)
	    {
	      this.addAddress();
	    }
  	}

  	addAddress() 
  	{
    	this.submitAttempt = true;

    	if(!this.moduleForm.valid)
    	{ 
      		
    	} 
    	else 
    	{
    		if(this.country_id != '' && this.state_id != '' && this.city_id != '')
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
	        		'first_name': this.moduleForm.value.first_name,'last_name': this.moduleForm.value.last_name,'company': this.moduleForm.value.company,'mobile': this.moduleForm.value.mobile,'address1': this.moduleForm.value.address1, 'address2': this.moduleForm.value.address2,'country_id': this.country_id,'state_id': this.state_id,'city_id': this.city_id,'pincode': this.moduleForm.value.pincode,'is_billing_default': 0,'is_shipping_default': 0,'mobile_access_token': mobile_access_token
	      		};
	      		this.moduleService.add_address('', { form_data }).then((data: any) => 
	      		{
			        if(data) 
			        {
			            this.loadingModal.dismiss();
			            if(data.status_code == 200)
			            {
			              	/*let toast = this.toastCtrl.create
			              	({
			                  	message: data.message,
			                  	duration: 1500,
			                  	position: 'bottom',
			              	});
			              	toast.present();*/
			              	this.reloadPage();
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
    			if(this.country_id == '')
    			{
    				let toast = this.toastCtrl.create
	              	({
	                  	message: 'Please Select Country',
	                  	duration: 1500,
	                  	position: 'top'
	              	});
	              	toast.present();
    			}
    			else if(this.state_id == '')
    			{
    				let toast = this.toastCtrl.create
	              	({
	                  	message: 'Please Select State',
	                  	duration: 1500,
	                  	position: 'top'
	              	});
	              	toast.present();
    			}
    			else
    			{
    				let toast = this.toastCtrl.create
	              	({
	                  	message: 'Please Select City',
	                  	duration: 1500,
	                  	position: 'top'
	              	});
	              	toast.present();
    			}
    		}
    	}
  	}

  	

  	getAddressId(address_id)
  	{
		this.address_id = address_id;
  	}

  	getApplyCode(keyCode,data)
  	{
  		this.coupon_code = data;
	    if(keyCode == 13)
	    {
	      	this.applyCouponCode();
	    }
  	}

  	applyCouponCode()
	{
		if(this.coupon_code != '')
		{
			//this.disable_applied_coupon_code = true;
			//this.is_coupon_apply = 1;
			var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
	  		this.loadingModal = this.loadingCtrl.create(
		    {
		      	spinner:'hide',
		      	content: '<img src="assets/icon/loader.gif">',
      			//dismissOnPageChange: true,
                enableBackdropDismiss: true
		    });
		    this.loadingModal.present();
		    this.moduleService.apply_remove_coupon_code(this.coupon_code,1,mobile_access_token).then((db_result: any) => 
		    {
		      	this.db_result = db_result;
		      	if(db_result.status_code == 200)
		      	{ 
		        	this.disable_applied_coupon_code = true;
					this.is_coupon_apply = 1;
					//this.coupon_code_discount = db_result.coupon_discount;
					let toast = this.toastCtrl.create
			        ({
			            message: db_result.message,
			            duration: 1500,
			            position: 'bottom',
			        });
			        toast.present();
			        this.reloadPage1();
		      	}
		      	else
		      	{
			        this.disable_applied_coupon_code = false;
					this.is_coupon_apply = 0;
					this.coupon_code_discount = '0';
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
		else
		{
			let toast = this.toastCtrl.create
	        ({
	            message: 'Please Enter Coupon Code',
	            duration: 1500,
	            position: 'bottom',
	        });
	        toast.present();
		}
	}

	removeCouponCode()
	{
		//this.disable_applied_coupon_code = false;
		//this.is_coupon_apply = 0;

		var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
  		this.loadingModal = this.loadingCtrl.create(
	    {
	      	spinner:'hide',
	      	content: '<img src="assets/icon/loader.gif">',
      		//dismissOnPageChange: true,
                enableBackdropDismiss: true
	    });
	    this.loadingModal.present();
	    this.moduleService.apply_remove_coupon_code(this.coupon_code,0,mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
		      	this.coupon_code = '';
		        this.disable_applied_coupon_code = false;
				this.is_coupon_apply = 0;
				this.reloadPage1();
				let toast = this.toastCtrl.create
		        ({
		            message: db_result.message,
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
	      	}
	      	else
	      	{
		        this.disable_applied_coupon_code = true;
				this.is_coupon_apply = 1;
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

	reloadPage1()
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
	    this.moduleService.view_checkout_data(mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	        	this.cart_data_array = db_result.data.cart;
	        	this.address_count = db_result.address_count;
	        	//if(db_result.data.address == '')
	        	if(db_result.address_count == 0)
	        	{
	        		this.show_add_address = 1;
	        		this.address_data_array = '';
	        		this.getState();
	        	}
	        	else
	        	{
	        		this.address_data_array = db_result.data.address;
	        		for (var v in this.address_data_array) 
			      	{
				        var address_data = this.address_data_array[v];
				        this.address_id = address_data.id;
				        break;
			      	}
	        	}
		        //this.sub_total = db_result.sub_total_amount;
		        //this.coupon_discount = db_result.coupon_discount;
		        //this.shipping_charges = db_result.shipping_charges;
		        //this.total_amount = db_result.order_total_amount;

		        this.sub_total_amount = db_result.sub_total_amount;
	        	this.coupon_code_discount = db_result.coupon_discount;
	        	this.is_coupon_apply = db_result.is_coupon_apply;
	        	this.shipping_amount = db_result.shipping_charges;
	        	this.coupon_code = db_result.coupon_code;
	        	this.payment_method = 'COD';
	        	this.total_amount = db_result.order_total_amount;
	        	this.days_data_array = db_result.days_array;
	        	//this.checkout_unique_key = db_result.checkout_unique_key;
	        	this.is_wallet_apply = db_result.is_wallet_apply;
	        	this.wallet_amount = db_result.wallet_amount;
	        	this.user_wallet_remaining_amount = db_result.user_wallet_remaining_amount;

	        	if(db_result.is_coupon_apply == 0)
	        	{
	        		this.disable_applied_coupon_code = false;
	        		this.coupon_code = '';
	        	}
	        	else
	        	{
	        		this.disable_applied_coupon_code = true;
	        		this.coupon_code = db_result.coupon_code;
	        	}
	        	this.is_coupon_apply = db_result.is_coupon_apply;
	        	this.item_count = 1;
	      	}
	      	else
	      	{
	        	this.cart_data_array = '';
	        	this.address_data_array = '';
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

	applyWallet(type)
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
		    this.moduleService.apply_wallet(type,mobile_access_token).then((db_result: any) => 
		    {
		      	this.db_result = db_result;
		      	if(db_result.status_code == 200)
		      	{
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

	reloadPage()
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
	    this.moduleService.view_checkout_data(mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	        	this.cart_data_array = db_result.data.cart;
	        	//if(db_result.data.address == '')
	        	this.address_count = db_result.address_count;
	        	if(db_result.address_count == 0)
	        	{
	        		this.show_add_address = 1;
	        		this.address_data_array = '';
	        		this.getState();
	        	}
	        	else
	        	{
	        		this.address_data_array = db_result.data.address;
	        		for (var v in this.address_data_array) 
			      	{
				        var address_data = this.address_data_array[v];
				        this.address_id = address_data.id;
				        break;
			      	}
	        	}
		        //this.sub_total = db_result.sub_total_amount;
		        //this.coupon_discount = db_result.coupon_discount;
		        //this.shipping_charges = db_result.shipping_charges;
		        //this.total_amount = db_result.order_total_amount;

		        this.sub_total_amount = db_result.sub_total_amount;
	        	this.coupon_code_discount = db_result.coupon_discount;
	        	this.is_coupon_apply = db_result.is_coupon_apply;
	        	this.shipping_amount = db_result.shipping_charges;
	        	this.coupon_code = db_result.coupon_code;
	        	this.payment_method = 'COD';
	        	this.total_amount = db_result.order_total_amount;
	        	this.days_data_array = db_result.days_array;
	        	//this.checkout_unique_key = db_result.checkout_unique_key;
	        	this.is_wallet_apply = db_result.is_wallet_apply;
	        	this.wallet_amount = db_result.wallet_amount;
	        	this.user_wallet_remaining_amount = db_result.user_wallet_remaining_amount;

	        	if(db_result.is_coupon_apply == 0)
	        	{
	        		this.disable_applied_coupon_code = false;
	        		this.coupon_code = '';
	        	}
	        	else
	        	{
	        		this.disable_applied_coupon_code = true;
	        		this.coupon_code = db_result.coupon_code;
	        	}
	        	this.is_coupon_apply = db_result.is_coupon_apply;
	        	this.item_count = 1;
	      	}
	      	else
	      	{
	        	this.cart_data_array = '';
	        	this.address_data_array = '';
	        	this.item_count = 0;
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

	orderNow(type)
	{
		if(this.address_id == '')
		{
			this.addDirectAddress();
		}
		else if(this.address_id != '' && this.payment_method_type != '')
		{
			if(this.days_title != '' && this.slot_id != '')
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
			    this.moduleService.order_now(this.cart_data_array,this.address_id,this.payment_method_type,this.payment_id,type,this.days_title,this.slot_id,mobile_access_token).then((db_result: any) => 
			    {
			    	this.loadingModal.dismiss();
			      	this.db_result = db_result;
			      	if(db_result.status_code == 200)
			      	{ 
				        if(this.payment_method_type == '2')
				        {
				        	let toast = this.toastCtrl.create
					        ({
					            message: db_result.message,
					            duration: 1500,
					            position: 'bottom',
					        });
					        toast.present();
					        localStorage.setItem('cart_items_count', '0');
				        	this.navCtrl.setRoot('ThankYouPage');
				        }
				        else
				        {
				        	var get_link = db_result.get_link;
				        	this.checkout_unique_key = db_result.checkout_unique_key;
				        	var temp_link = get_link+'?id1='+db_result.checkout_unique_key+'&id2='+db_result.days_title+'&id3='+db_result.slot_time;
				        	this.platform.ready().then(() => 
					        {
					        	//alert("Enter Event");
				                const browser = cordova.InAppBrowser.open(temp_link, '_blank', 'location=yes');
				                browser.addEventListener('loadstop', (event) => 
				                {
				                	//alert("load stop");
				                });

				                browser.addEventListener('loadstart', (event) => 
				                {
				                	//alert("load start");
				                });

				                browser.addEventListener('exit', (event) => 
				                {
				                	//this.checkOrderPaymentStatus();
							        this.navCtrl.setRoot('ViewMyCartPage');
				                });
					        });
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
				        if(db_result.status_code == 300)
				        {
				        	this.ionViewWillEnter();
				        }
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
			else
			{
				if(this.days_title == '')
				{
					let toast = this.toastCtrl.create
			        ({
			            message: 'Please Select Day',
			            duration: 1500,
			            position: 'bottom',
			        });
			        toast.present();
				}
				else
				{
					let toast = this.toastCtrl.create
			        ({
			            message: 'Please Select Slot',
			            duration: 1500,
			            position: 'bottom',
			        });
			        toast.present();
				}
			}
		}
		else
		{
			if(this.address_id == '')
			{
				let toast = this.toastCtrl.create
		        ({
		            message: 'Please Select Address',
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
			}
			else
			{
				let toast = this.toastCtrl.create
		        ({
		            message: 'Please Select Payment Method',
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
			}
		}
	}

	checkOrderPaymentStatus()
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
	    this.moduleService.view_order_payment_status(this.checkout_unique_key,mobile_access_token).then((db_result: any) => 
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
            	this.loadingModal.dismiss();
            	localStorage.setItem('cart_items_count', '0');
            	this.navCtrl.setRoot('ThankYouPage');
	      	}
	      	else
	      	{
	        	let toast = this.toastCtrl.create
	            ({
	                message: db_result.message,
	                duration: 1500,
	                position: 'bottom',
	            });
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

	addDirectAddress() 
  	{
    	this.submitAttempt = true;

    	if(!this.moduleForm.valid)
    	{ 
      		let alert = this.alertCtrl.create
            ({
                title: 'Please Add Address',
                subTitle: '',
                buttons: ['OK']
            });
            alert.present();
    	} 
    	else 
    	{
    		if(this.country_id != '' && this.state_id != '' && this.city_id != '')
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
	        		'first_name': this.moduleForm.value.first_name,'last_name': this.moduleForm.value.last_name,'company': this.moduleForm.value.company,'mobile': this.moduleForm.value.mobile,'address1': this.moduleForm.value.address1, 'address2': this.moduleForm.value.address2,'country_id': this.country_id,'state_id': this.state_id,'city_id': this.city_id,'pincode': this.moduleForm.value.pincode,'is_billing_default': 0,'is_shipping_default': 0,'mobile_access_token': mobile_access_token
	      		};
	      		this.moduleService.add_address('', { form_data }).then((data: any) => 
	      		{
			        if(data) 
			        {
			            this.loadingModal.dismiss();
			            if(data.status_code == 200)
			            {
			              	/*let toast = this.toastCtrl.create
			              	({
			                  	message: data.message,
			                  	duration: 1500,
			                  	position: 'bottom',
			              	});
			              	toast.present();*/
			              	this.reloadDirectPage();
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
	          		this.loadingModal.dismiss();
	      		});
    		}
    		else
    		{
    			if(this.country_id == '')
    			{
    				let toast = this.toastCtrl.create
	              	({
	                  	message: 'Please Select Country',
	                  	duration: 1500,
	                  	position: 'top'
	              	});
	              	toast.present();
    			}
    			else if(this.state_id == '')
    			{
    				let toast = this.toastCtrl.create
	              	({
	                  	message: 'Please Select State',
	                  	duration: 1500,
	                  	position: 'top'
	              	});
	              	toast.present();
    			}
    			else
    			{
    				let toast = this.toastCtrl.create
	              	({
	                  	message: 'Please Select City',
	                  	duration: 1500,
	                  	position: 'top'
	              	});
	              	toast.present();
    			}
    		}
    	}
  	}

  	reloadDirectPage()
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
	    this.moduleService.view_checkout_data(mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	        	this.cart_data_array = db_result.data.cart;
	        	//if(db_result.data.address == '')
	        	this.address_count = db_result.address_count;
	        	if(db_result.address_count == 0)
	        	{
	        		this.show_add_address = 1;
	        		this.address_data_array = '';
	        		this.getState();
	        	}
	        	else
	        	{
	        		this.address_data_array = db_result.data.address;
	        		for (var v in this.address_data_array) 
			      	{
				        var address_data = this.address_data_array[0];
				        this.address_id = address_data.id;
				        break;
			      	}
	        	}
		        //this.sub_total = db_result.sub_total_amount;
		        //this.coupon_discount = db_result.coupon_discount;
		        //this.shipping_charges = db_result.shipping_charges;
		        //this.total_amount = db_result.order_total_amount;

		        this.sub_total_amount = db_result.sub_total_amount;
	        	this.coupon_code_discount = db_result.coupon_discount;
	        	this.is_coupon_apply = db_result.is_coupon_apply;
	        	this.shipping_amount = db_result.shipping_charges;
	        	this.coupon_code = db_result.coupon_code;
	        	this.payment_method = 'COD';
	        	this.total_amount = db_result.order_total_amount;
	        	this.days_data_array = db_result.days_array;
	        	//this.checkout_unique_key = db_result.checkout_unique_key;
	        	this.is_wallet_apply = db_result.is_wallet_apply;
	        	this.wallet_amount = db_result.wallet_amount;
	        	this.user_wallet_remaining_amount = db_result.user_wallet_remaining_amount;

	        	if(db_result.is_coupon_apply == 0)
	        	{
	        		this.disable_applied_coupon_code = false;
	        		this.coupon_code = '';
	        	}
	        	else
	        	{
	        		this.disable_applied_coupon_code = true;
	        		this.coupon_code = db_result.coupon_code;
	        	}
	        	this.is_coupon_apply = db_result.is_coupon_apply;
	        	this.item_count = 1;
	        	this.orderNow(1);
	      	}
	      	else
	      	{
	        	this.cart_data_array = '';
	        	this.address_data_array = '';
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

	closeBrowserMethod()
	{
		alert("Hello Payment Success");
	}

  	finalOrderNow()
	{
		if(this.address_id == '')
		{
			this.addDirectAddress();
		}
		else if(this.address_id != '' && this.payment_method_type != '')
		{
			if(this.days_title != '' && this.slot_id != '')
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
			    this.moduleService.order_now(this.cart_data_array,this.address_id,this.payment_method_type,this.payment_id,'2',this.days_title,this.slot_id,mobile_access_token).then((db_result: any) => 
			    {
			    	this.loadingModal.dismiss();
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
				        if(this.payment_id != '')
				        {
				        	localStorage.setItem('cart_items_count', '0');
				        	this.navCtrl.setRoot('ThankYouPage');
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
				        if(db_result.status_code == 300)
				        {
				        	this.ionViewWillEnter();
				        }
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
			else
			{
				if(this.days_title == '')
				{
					let toast = this.toastCtrl.create
			        ({
			            message: 'Please Select Day',
			            duration: 1500,
			            position: 'bottom',
			        });
			        toast.present();
				}
				else
				{
					let toast = this.toastCtrl.create
			        ({
			            message: 'Please Select Slot',
			            duration: 1500,
			            position: 'bottom',
			        });
			        toast.present();
				}
			}
		}
		else
		{
			if(this.address_id == '')
			{
				let toast = this.toastCtrl.create
		        ({
		            message: 'Please Select Address',
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
			}
			else
			{
				let toast = this.toastCtrl.create
		        ({
		            message: 'Please Select Payment Method',
		            duration: 1500,
		            position: 'bottom',
		        });
		        toast.present();
			}
		}
	}

  	getPayment(method_name,type)
  	{
  		this.payment_method = method_name;
  		this.payment_method_type = type;  	
  	}

  	onChangeDays(days_data)
  	{
  		if(days_data != '')
  		{
  			this.days_title = days_data;
	  		var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
	  		this.loadingModal = this.loadingCtrl.create(
		    {
		      	spinner:'hide',
		      	content: '<img src="assets/icon/loader.gif">',
	      		//dismissOnPageChange: true,
	            enableBackdropDismiss: true
		    });
		    this.loadingModal.present();
		    this.moduleService.get_slot(days_data,mobile_access_token).then((db_result: any) => 
		    {
		      	this.db_result = db_result;
		      	if(db_result.status_code == 200)
		      	{
		        	this.slot_data_array = db_result.slot_array;
		      	}
		      	else
		      	{
			        this.slot_data_array = '';
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

  	onChangeDate()
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
	    this.moduleService.get_slot(this.slot_date,mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	        	this.slot_data_array = db_result.slot_array;
	      	}
	      	else
	      	{
		        this.slot_data_array = '';
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

  	onChangeSlot(slot_id)
  	{
  		this.slot_id = slot_id;
  	}

  	viewCountry()
    {
      	let modal = this.modalCtrl.create('ViewCountryPage');
      	modal.onDidDismiss(data => 
      	{
        	if(data) 
        	{
        		if(data.count == 1)
          		{
      				this.is_state_show = 1;
      				if(this.country_id != data.country_id)
      				{
      					this.state_id = '';
				      	this.state_name = 'Select State';
				      	this.city_id = '';
				      	this.city_name = 'Select City';
	      				this.is_city_show = 0;
      				}
      				this.country_id = data.country_id;
          			this.country_name = data.country_name;
          		}
          		else
          		{
          			if(this.country_id == '')
	          		{
	          			this.country_name = 'Select Country';
	          			this.state_id = '';
				      	this.state_name = 'Select State';
				      	this.city_id = '';
				      	this.city_name = 'Select City';
	      				this.is_state_show = 0;
	      				this.is_city_show = 0;
	          		}
	          		else
	          		{
	          			this.is_state_show = 1;
	          			if(this.state_id == '')
		          		{
					      	this.state_name = 'Select State';
					      	this.city_id = '';
					      	this.city_name = 'Select City';
		      				this.is_city_show = 0;
		          		}
		          		else
		          		{
		          			this.is_city_show = 1;
		          			if(this.city_id == '')
			          		{
						      	this.city_name = 'Select City';
			          		}
		          		}
	          		}
          		}
        	}
      	});
      	modal.present();
    }

    viewState()
    {
      	let modal = this.modalCtrl.create('ViewStatePage',{ country_id:this.country_id });
      	modal.onDidDismiss(data => 
      	{
        	if(data) 
        	{
        		if(data.count == 1)
          		{
      				this.is_city_show = 1;
      				if(this.state_id != data.state_id)
      				{
				      	this.city_id = '';
				      	this.city_name = 'Select City';
      				}
      				this.state_id = data.state_id;
          			this.state_name = data.state_name;
          		}
          		else
          		{
          			if(this.country_id == '')
	          		{
	          			this.country_name = 'Select Country';
	          			this.state_id = '';
				      	this.state_name = 'Select State';
				      	this.city_id = '';
				      	this.city_name = 'Select City';
	      				this.is_state_show = 0;
	      				this.is_city_show = 0;
	          		}
	          		else
	          		{
	          			this.is_state_show = 1;
	          			if(this.state_id == '')
		          		{
					      	this.state_name = 'Select State';
					      	this.city_id = '';
					      	this.city_name = 'Select City';
		      				this.is_city_show = 0;
		          		}
		          		else
		          		{
		          			this.is_city_show = 1;
		          			if(this.city_id == '')
			          		{
						      	this.city_name = 'Select City';
			          		}
		          		}
	          		}
          		}
        	}
      	});
      	modal.present();
    }

    viewCity()
    {
      	let modal = this.modalCtrl.create('ViewCityPage',{ country_id:this.country_id,state_id:this.state_id });
      	modal.onDidDismiss(data => 
      	{
        	if(data) 
        	{
        		console.log(data);
        		if(data.count == 1)
          		{
      				this.is_city_show = 1;
      				this.city_id = data.city_id;
          			this.city_name = data.city_name;
          		}
          		else
          		{
          			if(this.country_id == '')
	          		{
	          			this.country_name = 'Select Country';
	          			this.state_id = '';
				      	this.state_name = 'Select State';
				      	this.city_id = '';
				      	this.city_name = 'Select City';
	      				this.is_state_show = 0;
	      				this.is_city_show = 0;
	          		}
	          		else
	          		{
	          			this.is_state_show = 1;
	          			if(this.state_id == '')
		          		{
					      	this.state_name = 'Select State';
					      	this.city_id = '';
					      	this.city_name = 'Select City';
		      				this.is_city_show = 0;
		          		}
		          		else
		          		{
		          			this.is_city_show = 1;
		          			if(this.city_id == '')
			          		{
						      	this.city_name = 'Select City';
			          		}
		          		}
	          		}
          		}
        	}
      	});
      	modal.present();
    }

    addNewAddress()
    {
    	this.navCtrl.push('AddAddressPage');
    }
}

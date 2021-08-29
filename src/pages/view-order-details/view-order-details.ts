import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,AlertController } from 'ionic-angular';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http }  from '@angular/http';
import { ModuleProvider } from '../../providers/module-service';
import { ScrollHideConfig } from '../../directives/scroll-hide/orders-details-scroll-hide';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-view-order-details',
  templateUrl: 'view-order-details.html',
})

export class ViewOrderDetailsPage 
{
	loadingModal: any;
  	db_result: any;
  	
	moduleForm: FormGroup;
  	submitAttempt: boolean = false;

  	orders_data_array: any;
  	address_data: any;
  	item_count: number;

  	order_id : string = '';
  	reason_type : string = '';
  	order_status_code : number = 1;
  	is_show_cancel_option : number = 0;
  	is_show_cancel_order_reason : number = 0;

  	slot_day : string = '';
  	slot_time : string = '';
  	order_date : string = '';
  	order_status : string = '';
  	order_status_color : string = '';
  	sub_total_amount : string = '0';
  	coupon_code_discount : string = '0';
  	shipping_amount : string = '0';
  	coupon_code : string = '';
  	payment_method : string = '';
  	total_amount : string = '0';
  	is_coupon_apply : number = 0;

  	is_wallet_apply : string =  '0';
    total_wallet_amount : number =  0;

  	footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 57 };
    
  	constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
	{
	    this.navCtrl= navCtrl;
	    this.http = http;
	    this.moduleForm = formBuilder.group
	    ({
	      	cancel_order_reason: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(100),  Validators.required])],
	    });

	    this.order_id = this.navParams.get('order_id');
	    this.order_status_code = this.navParams.get('order_status_code');
	    this.order_date = this.navParams.get('order_date');
	    this.order_status = this.navParams.get('order_status');
	    this.order_status_color = this.navParams.get('order_status_color');
	}

	doRefresh(refresher)
	{
		setTimeout(() => 
		{
      		this.ionViewDidLoad();
      		refresher.complete();
    	}, 1000);
	}


	ionViewWillEnter()
  	{
  		localStorage.setItem('page_name', JSON.stringify('ViewOrderDetailsPage'));
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

  	reloadPage()
  	{
  		this.ionViewDidLoad();
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

  		var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
  		this.loadingModal = this.loadingCtrl.create(
	    {
	      	spinner:'hide',
	      	content: '<img src="assets/icon/loader.gif">',
      		//dismissOnPageChange: true,
                enableBackdropDismiss: true
	    });
	    this.loadingModal.present();
	    this.moduleService.view_order_details(mobile_access_token,this.order_id).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	      		this.item_count = 1;
	        	this.orders_data_array = db_result.data.user_order;
	        	this.address_data = db_result.data.address;
	        	this.sub_total_amount = db_result.sub_total_amount;
	        	this.slot_day = db_result.slot_day;
	        	this.slot_time = db_result.slot_time;
	        	this.coupon_code_discount = db_result.coupon_discount;
	        	this.is_coupon_apply = db_result.is_coupon_apply;
	        	this.shipping_amount = db_result.shipping_charges;
	        	this.coupon_code = db_result.coupon_code;
	        	this.payment_method = db_result.mode_of_payment;
	        	this.total_amount = db_result.order_total_amount;
	        	this.is_wallet_apply = db_result.is_wallet_apply;
	        	this.total_wallet_amount = db_result.total_wallet_amount;
	        	this.loadingModal.dismiss();
	      	}
	      	else
	      	{
		        this.orders_data_array = '';
		        this.address_data = '';
		        this.sub_total_amount = '0';
		        this.coupon_code_discount = '0';
		        this.is_coupon_apply = 0;
		        this.shipping_amount = '0';
		        this.coupon_code = '';
		        this.payment_method = '';
		        this.total_amount = '0';
		        this.item_count = 0;
		        this.is_wallet_apply = '0';
		        this.total_wallet_amount = 0;
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

	eventHandler(keyCode,data)
  	{
	    if(keyCode == 13)
	    {
	      this.cancelOrder();
	    }
  	}

  	showCancelOrderOption(type)
  	{
  		if(type == 1)
	    {
	    	this.is_show_cancel_option = 1;
	    }
	    else
	    {
	    	this.is_show_cancel_option = 0;
	    }
  	}

  	reasonType(type)
  	{
  		this.reason_type = type;
  		if(type == 0)
  		{
  			this.moduleForm.value.cancel_order_reason = '';
  			this.is_show_cancel_order_reason = 1;
  		}
  		else
  		{
  			this.is_show_cancel_order_reason = 0;
  		}
  	}

  	cancelOrder()
  	{
  		this.submitAttempt = true;

    	if(!this.moduleForm.valid)
    	{ 
      		
    	} 
    	else 
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
        		'reason_type': this.reason_type,'cancel_order_reason': this.moduleForm.value.cancel_order_reason,'order_id': this.order_id,'mobile_access_token': mobile_access_token
      		};
      		this.moduleService.cancel_order('', { form_data }).then((data: any) => 
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
  	}
}

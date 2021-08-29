import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController,ToastController, App,AlertController } from 'ionic-angular';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http }  from '@angular/http';
import { ModuleProvider } from '../../providers/module-service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-cancel-order',
  templateUrl: 'cancel-order.html',
})

export class CancelOrderPage 
{
	loadingModal: any;
  	db_result: any;

	moduleForm: FormGroup;
  	submitAttempt: boolean = false;

  	form_show:number = 1;

  	reason_type : string = 'Recipient not available at day of delivery';
  	order_id : string = '';
  	order_status : string = '';
  	order_status_color : string = '';
    order_date : string = '';
  	total_wallet_amount : string = '0';

  	public cssClass= 'background_color_content_1';

	constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public _app: App, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
	{
	    this.navCtrl= navCtrl;
	    this.http = http;
	    this.moduleForm = formBuilder.group
	    ({
	      	cancel_order_reason: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(256)])]
	    });

	    this.order_id = this.navParams.get('order_id');
	    this.order_status = this.navParams.get('order_status');
	    this.order_status_color = this.navParams.get('order_status_color');
      this.order_date = this.navParams.get('order_date');
	    this.total_wallet_amount = this.navParams.get('total_wallet_amount');
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
    
	reasonType(type)
  	{
  		this.reason_type = type;
  	}

	eventHandler(keyCode,data)
  	{
	    if(keyCode == 13)
	    {
	      this.cancelOrder();
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
        		'order_id': this.order_id,'reason_type': this.reason_type,'cancel_order_reason': this.moduleForm.value.cancel_order_reason,'mobile_access_token': mobile_access_token
      		};
      		this.moduleService.cancel_order('', { form_data }).then((data: any) => 
      		{
		        if(data) 
		        {
		            this.loadingModal.dismiss();
		            if(data.status_code == 200)
		            {
		              	//this.form_show = 0;
		              	//this.cssClass = 'background_color_content_2';
                    this.navCtrl.setRoot('CancelPage');
		            }
		            else
		            {
		            	this.form_show = 1;
		            	this.cssClass = 'background_color_content_1';
		              	let toast = this.toastCtrl.create
		              	({
		                  	message: data.message,
		                  	duration: 1500,
		                  	position: 'bottom'
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

    shopping()
    {
        this.navCtrl.setRoot('ViewMainCategoriesPage');
    }
}

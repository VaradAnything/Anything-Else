import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,AlertController } from 'ionic-angular';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http }  from '@angular/http';
import { ModuleProvider } from '../../providers/module-service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-profile-mobile-otp',
  templateUrl: 'profile-mobile-otp.html',
})

export class ProfileMobileOtpPage 
{
    loadingModal: any;
    db_result: any;

	moduleForm: FormGroup;
  	submitAttempt: boolean = false;
  	moduleFormOtp: FormGroup;
  	submitAttemptOtp: boolean = false;
  
  	otp : number = 0;

  	is_show_otp_div : number = 0;
  	is_show_footer_otp : number = 0;
  	disable_mobile: boolean = false;

  	disable_otp: boolean = false;

  	email : string = '';
  	disable_email: boolean = true;
  	mobile : string = '';
  	is_mobile_entered : number = 0;
    module_type : number = 2;

  	constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
  	{
      	this.navCtrl= navCtrl;
      	this.http = http;
      	this.moduleForm = formBuilder.group
      	({
      		mobile: ['', Validators.compose([Validators.minLength(10),Validators.maxLength(10),  Validators.required])],
      	});

      	this.moduleFormOtp = formBuilder.group
      	({
      		otp: ['', Validators.compose([Validators.minLength(4),Validators.maxLength(4),  Validators.required])],
      	});

      	this.email = this.navParams.get('email');
        this.mobile = this.navParams.get('mobile');
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

    ionViewWillEnter()
    {
      localStorage.setItem('page_name', JSON.stringify('ProfileMobileOtpPage'));
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
      let elements = document.querySelectorAll(".tabbar");

      if (elements != null) 
      {
          Object.keys(elements).map((key) => 
          {
              elements[key].style.display = 'flex';
          });
      }
    }

  	eventHandler(keyCode,data)
  	{
    	if(keyCode == 13)
    	{
    		this.is_mobile_entered = 1;
      		this.continue();
    	}
  	}

  	continue()
  	{
    	this.submitAttempt = true;

    	if(!this.moduleForm.valid)
    	{ 
      
    	} 
    	else 
    	{
      		this.mobile = this.moduleForm.value.mobile;
      		this.getOtp(1);
    	}
  	}

  	getOtp(temp_type)
    {
      if(temp_type == '2')
      {
        this.submitAttemptOtp = false;
        this.moduleFormOtp.reset();
      }
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
        	'email': this.email,'mobile': this.mobile,'type': '1','mobile_access_token': mobile_access_token
      	};
      	this.moduleService.profile_forgot_password('', { form_data }).then((data: any) => 
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
	              	this.is_mobile_entered = 1;
	              	this.disable_mobile = true;
	              	this.is_show_otp_div = 1;
	              	this.is_show_footer_otp = 1;
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
	              	this.disable_mobile = false;
	              	this.is_show_otp_div = 0;
	              	this.is_show_footer_otp = 0;
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

  	eventHandlerOtp(keyCode,data)
  	{
    	if(keyCode == 13)
    	{
      		this.verifyOtp();
    	}
  	}

  	verifyOtp()
  	{
  		var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
    	this.submitAttemptOtp = true;

    	if(!this.moduleFormOtp.valid)
    	{ 
      
    	} 
    	else 
    	{
      		this.otp = this.moduleFormOtp.value.otp;

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
        		'email': this.email,'mobile': this.mobile,'otp': this.moduleFormOtp.value.otp,'type': '2','mobile_access_token': mobile_access_token
      		};
      		this.moduleService.profile_forgot_password('', { form_data }).then((data: any) => 
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
		              	this.disable_mobile = true;
		              	this.is_show_otp_div = 1;
		              	this.disable_otp = true;
		              	this.is_show_footer_otp = 0;
                    this.navCtrl.setRoot('ViewProfilePage');
		            }
		            else
		            {
		              	this.disable_otp = false;
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

  	changeMobileNumber()
	{
		this.is_mobile_entered = 0;
		this.disable_mobile = false;
    this.disable_otp = false;
  		this.is_show_otp_div = 0;
  		this.is_show_footer_otp = 0;
	}

  	backButton()
  	{
    	this.navCtrl.pop();
  	}
}

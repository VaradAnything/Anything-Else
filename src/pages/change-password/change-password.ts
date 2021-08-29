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
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})

export class ChangePasswordPage 
{
	loadingModal: any;
  	db_result: any;

	moduleForm: FormGroup;
  	submitAttempt: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public _app: App, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
	{
	    this.navCtrl= navCtrl;
	    this.http = http;
	    this.moduleForm = formBuilder.group
	    ({
	      	old_password: ['', Validators.compose([Validators.minLength(6),Validators.maxLength(30),  Validators.required])],
	      	new_password: ['', Validators.compose([Validators.minLength(6),Validators.maxLength(30),  Validators.required])],
	      	confirm_password: ['', Validators.compose([Validators.minLength(6),Validators.maxLength(30),  Validators.required])]
	    });
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
    	console.log('ionViewDidLoad ContactUsPage');
  	}

  	ionViewWillEnter()
  	{
  		localStorage.setItem('page_name', JSON.stringify('ChangePasswordPage'));
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

	eventHandler(keyCode,data)
  	{
	    if(keyCode == 13)
	    {
	      this.changePassword();
	    }
  	}

  	changePassword()
  	{
  		this.submitAttempt = true;

    	if(!this.moduleForm.valid)
    	{ 
      		
    	} 
    	else 
    	{
    		if(this.moduleForm.value.new_password == this.moduleForm.value.confirm_password)
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
	        		'old_password': this.moduleForm.value.old_password,'new_password': this.moduleForm.value.new_password,'repeat_password': this.moduleForm.value.confirm_password,'mobile_access_token': mobile_access_token
	      		};
	      		this.moduleService.change_password('', { form_data }).then((data: any) => 
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
			              	this.navCtrl.setRoot('SigninPage');
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
      			let toast = this.toastCtrl.create
              	({
                  	message: 'Confirm Password Should Be Matched With New Password',
                  	duration: 1500,
                  	position: 'bottom',
              	});
              	toast.present();
      		}
    	}
  	}
}

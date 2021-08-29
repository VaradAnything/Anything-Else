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
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})

export class ViewProfilePage 
{
	loadingModal: any;
  	db_result: any;

	moduleForm: FormGroup;
  	submitAttempt: boolean = false;

  	profile_data_array : any;

  	first_name: string = '';
  	last_name: string = '';
  	email: string = '';
  	mobile: string = '';
  	gender: string = '';
  	total_wallet_amount: string = '0';
  	item_count: number;

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
		localStorage.setItem('page_name', JSON.stringify('ViewProfilePage'));
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
	    this.moduleService.view_profile_data(mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	      		this.item_count = 1;
	        	this.first_name = db_result.data.first_name;
	        	this.last_name = db_result.data.last_name;
	        	this.email = db_result.data.email;
	        	this.mobile = db_result.data.mobile;
	        	this.gender = db_result.data.gender;
	        	this.total_wallet_amount = db_result.data.total_wallet_amount;
	        	this.loadingModal.dismiss();
	      	}
	      	else
	      	{
		        this.first_name = '';
		        this.last_name = '';
		        this.email = '';
		        this.mobile = '';
		        this.gender = '';
		        this.total_wallet_amount = '0';
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
    	console.log('ionViewDidLoad ViewProfilePage');
  	}

  	editProfile()
  	{
  		this.navCtrl.push('EditProfilePage',{first_name:this.first_name,last_name:this.last_name,email:this.email,mobile:this.mobile,gender:this.gender});
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

  	logoutUser()
  	{
	    localStorage.removeItem('user_name');
	    localStorage.removeItem('email');
	    localStorage.removeItem('mobile');
	    localStorage.removeItem('mobile_access_token');
	    localStorage.removeItem('login_type');
	    localStorage.removeItem('cart_items_count');
	    localStorage.removeItem('product_variant_seo_url');
	    localStorage.removeItem('page_name');
	    this._app.getRootNav().setRoot('SigninPage');
	}

	reloadPage()
  	{
  		this.ionViewWillEnter();
  	}
}

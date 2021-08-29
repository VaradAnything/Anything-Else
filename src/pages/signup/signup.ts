import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController,ToastController, MenuController,AlertController } from 'ionic-angular';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http }  from '@angular/http';
import { ModuleProvider } from '../../providers/module-service';
import { Events } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
//import { Facebook } from '@ionic-native/facebook';
//import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component
({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage 
{
	loadingModal: any;
  	db_result: any;
  	
  	moduleForm: FormGroup;
  	submitAttempt: boolean = false;

  	gender:string = 'male';

  	view_cart: number = 0;

  	constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public events: Events,public datepipe: DatePipe,private menu: MenuController, private nativePageTransitions: NativePageTransitions, public nativeStorage: NativeStorage, public alertCtrl: AlertController)
  	//constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public events: Events,public datepipe: DatePipe,private menu: MenuController, private nativePageTransitions: NativePageTransitions,public fb: Facebook, public nativeStorage: NativeStorage,public alertCtrl: AlertController) 
	{
	    this.navCtrl= navCtrl;
	    this.http = http;
	    this.moduleForm = formBuilder.group
	    ({
	      	first_name: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(30),  Validators.required])],
	      	last_name: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(30),  Validators.required])],
	      	email: ['', Validators.compose([Validators.maxLength(100),  Validators.required, Validators.email])],
	      	mobile: ['', Validators.compose([Validators.minLength(10),Validators.maxLength(10),  Validators.required])],
	      	password: ['', Validators.compose([Validators.minLength(6),Validators.maxLength(30),  Validators.required])],
	      	confirm_password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30),  Validators.required])],
	    });
	    //this.fb.browserInit(this.FB_APP_ID, "v3.0");
	}

  	ionViewDidLoad()
  	{
  		this.menu.swipeEnable(false);
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
  		localStorage.setItem('page_name', JSON.stringify('SignupPage'));

  		localStorage.setItem('home_data', JSON.stringify(0));
    	localStorage.setItem('main_categories_data', JSON.stringify(0));

  		this.menu.swipeEnable(false);
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
  		this.menu.swipeEnable(true);
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'flex';
	        });
	    }
  	}

  	getGender(type)
  	{
  		this.gender = type;
  	}

  	eventHandler(keyCode,data)
  	{
	    if(keyCode == 13)
	    {
	      this.signup();
	    }
  	}

  	signup() 
  	{
    	this.submitAttempt = true;

    	if(!this.moduleForm.valid)
    	{ 
      		
    	} 
    	else 
    	{
    		if(this.moduleForm.value.password == this.moduleForm.value.confirm_password)
    		{
    			this.loadingModal = this.loadingCtrl.create
	      		({ 
	        		spinner:'hide',
	        		content: '<img src="assets/icon/loader.gif">',
      				//dismissOnPageChange: true,
                enableBackdropDismiss: true
	      		});
	      		this.loadingModal.present();

	      		var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

	      		localStorage.setItem('home_data', JSON.stringify(0));
    			localStorage.setItem('main_categories_data', JSON.stringify(0));
	      		
	      		let form_data = 
	      		{
	        		'first_name': this.moduleForm.value.first_name,'last_name': this.moduleForm.value.last_name,'email': this.moduleForm.value.email,'gender': this.gender,'mobile': this.moduleForm.value.mobile, 'password': this.moduleForm.value.password,'confirm_password': this.moduleForm.value.confirm_password,'registered_from': '','session_cart_data': without_login_cart_data_array
	      		};
	      		this.moduleService.signup('', { form_data }).then((data: any) => 
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

			              	var user_name = this.moduleForm.value.first_name + '' + this.moduleForm.value.last_name;

			              	if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) == '')
                            {
                                this.view_cart = 0;
                            }
                            else if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) != '')
                            {
                                this.view_cart = 1;
                            }
                            else
                            {
                                this.view_cart = 0;
                            }

			              	var without_login_cart_data_array = [];
			              	localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
			              	this.events.publish('side_menu_user_name:updated', user_name);
			              	this.events.publish('side_menu_login_type:updated', '1');
			              	localStorage.setItem('login_type', JSON.stringify(0));

			              	this.navCtrl.push('MobileOtpPage',{ email:this.moduleForm.value.email,mobile:this.moduleForm.value.mobile });
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
                  	message: 'Confirm Password Should Be Matched With Password',
                  	duration: 1500,
                  	position: 'bottom',
              	});
              	toast.present();
      		}
    	}
  	}

  	fbSignup()
  	{
	    /*let permissions = new Array<string>();
	    let nav = this.navCtrl;

	    permissions = ["public_profile"];

	    this.fb.login(permissions).then((response) =>
	    {
	      	let userId = response.authResponse.userID;
	      	let params = new Array<string>();

	      	this.fb.api("/me?fields=first_name,last_name,gender,email,id", params).then((user) =>
	      	{
	        	user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
	        	this.nativeStorage.setItem('user',
		        {
		          	first_name: user.first_name,
		          	last_name: user.last_name,
		          	email: user.email,
		          	gender: user.gender,
		          	picture: user.picture
		        })
	        	.then(() =>
	        	{
	          		this.loadingModal = this.loadingCtrl.create
	          		({
            			spinner:'hide',
	            		content: '<img src="assets/icon/loader.gif">'
	          		});
	          		this.loadingModal.present();

	          		var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

		      		localStorage.setItem('home_data', JSON.stringify(0));
	    			localStorage.setItem('main_categories_data', JSON.stringify(0));
		      		
		      		let form_data = 
		      		{
		        		'first_name': user.first_name,'last_name': user.last_name,'email': user.email,'gender': user.gender,'mobile': '', 'password': '','confirm_password': '','id': userId ,'registered_from': 'facebook','session_cart_data': without_login_cart_data_array
		      		};

	          		this.moduleService.signup('', { form_data }).then((data: any) => 
	          		{
			            if(data) 
			            {
			                if(data.status_code == 200)
			                {
			                  	let toast = this.toastCtrl.create
			                  	({
			                      	message: data.msg,
			                      	duration: 1500,
			                      	position: 'bottom',
			                  	});
			                  	toast.present();

			                  	var user_name = user.first_name + '' + user.last_name;

			                  	if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) == '')
	                            {
	                                this.view_cart = 0;
	                            }
	                            else if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) != '')
	                            {
	                                this.view_cart = 1;
	                            }
	                            else
	                            {
	                                this.view_cart = 0;
	                            }

				              	var without_login_cart_data_array = [];
				              	localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
				              	this.events.publish('side_menu_user_name:updated', user_name);
				              	this.events.publish('side_menu_login_type:updated', '1');
				              	localStorage.setItem('login_type', JSON.stringify(0));

				              	this.navCtrl.push('MobileOtpPage',{ email:user.email,mobile:'' });
			                }
			                else
			                {
			                  	let toast = this.toastCtrl.create
			                  	({
			                      	message: data.msg,
			                      	duration: 1500,
			                      	position: 'bottom'
			                  	});
			                  	toast.present();
			                }  
			                this.loadingModal.dismiss();   
			            }
	          		}, 
	          		(reson) => 
	          		{
		                let toast = this.toastCtrl.create
		                ({
		                    message: 'No Internet Connection',
		                    duration: 1500,
		                    position: 'bottom',
		                });
		                toast.present();
	              		this.loadingModal.dismiss();
	         	 	});
	        	},
	        	(error) =>
	        	{
	        	})
	      	})
	    },
	    (error) =>
	    {
	    });*/
  	}

  	googleSignup()
    {
        /*let loading = this.loadingCtrl.create
        ({
            content: 'Please wait...'
        });
        loading.present();*/
        /*this.loadingModal = this.loadingCtrl.create
        ({  
            spinner:'hide',
            content: '<img src="assets/icon/loader.gif">'
        });
        this.loadingModal.present();*/
        /*this.googlePlus.login
        ({
            'scopes': '',
            'webClientId': '78015579138-4042g5duplcdasp45gg2oq52eg1jkth7.apps.googleusercontent.com',
            'offline': true
        })
        .then((user) => 
        {
            //this.loadingModal.dismiss();

            this.nativeStorage.setItem('user', 
            {
                name: user.displayName,
                email: user.email,
                picture: user.imageUrl
            })
            .then(() => 
            {
                this.loadingModal = this.loadingCtrl.create
          		({
        			spinner:'hide',
            		content: '<img src="assets/icon/loader.gif">'
          		});
          		this.loadingModal.present();

          		var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

	      		localStorage.setItem('home_data', JSON.stringify(0));
    			localStorage.setItem('main_categories_data', JSON.stringify(0));

    			var display_name = user.displayName;
                let user_name = display_name.split(" ");
	      		
	      		let form_data = 
	      		{
	        		'first_name': user_name[0],'last_name': user_name[1],'email': user.email,'gender': user.gender,'mobile': '', 'password': '','confirm_password': '','id': user.userId ,'registered_from': 'google_plus','session_cart_data': without_login_cart_data_array
	      		};

          		this.moduleService.signup('', { form_data }).then((data: any) => 
          		{
		            if(data) 
		            {
		                if(data.status_code == 200)
		                {
		                  	let toast = this.toastCtrl.create
		                  	({
		                      	message: data.msg,
		                      	duration: 1500,
		                      	position: 'bottom',
		                  	});
		                  	toast.present();

		                  	var user_name = user.first_name + '' + user.last_name;

		                  	if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) == '')
                            {
                                this.view_cart = 0;
                            }
                            else if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) != '')
                            {
                                this.view_cart = 1;
                            }
                            else
                            {
                                this.view_cart = 0;
                            }

			              	var without_login_cart_data_array = [];
			              	localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
			              	this.events.publish('side_menu_user_name:updated', user_name);
			              	this.events.publish('side_menu_login_type:updated', '1');
			              	localStorage.setItem('login_type', JSON.stringify(0));

			              	this.navCtrl.push('MobileOtpPage',{ email:user.email,mobile:'' });
		                }
		                else
		                {
		                  	let toast = this.toastCtrl.create
		                  	({
		                      	message: data.msg,
		                      	duration: 1500,
		                      	position: 'bottom'
		                  	});
		                  	toast.present();
		                }  
		                this.loadingModal.dismiss();   
		            }
          		}, 
          		(reson) => 
          		{
          			//let alert = this.alertCtrl.create
	                //({
	                    //title: 'No Internet Connection',
	                    //subTitle: 'Please check your internet connection and try again',
	                    //buttons: ['OK']
	                //});
	                //alert.present();
	                let toast = this.toastCtrl.create
	                ({
	                    message: 'No Internet Connection',
	                    duration: 1500,
	                    position: 'bottom',
	                });
	                toast.present();
              		this.loadingModal.dismiss();
         	 	});
            }, (error) => 
            {
                console.log(error);
            })
        }, (error) => 
        {
            //this.loadingModal.dismiss();
        });*/
    }

  	signin() 
  	{
    	this.navCtrl.setRoot('SigninPage');
  	}
}
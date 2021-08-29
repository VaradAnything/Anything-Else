import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController,ToastController, ModalController,AlertController } from 'ionic-angular';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http }  from '@angular/http';
import { ModuleProvider } from '../../providers/module-service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-edit-address',
  templateUrl: 'edit-address.html',
})

export class EditAddressPage 
{
	loadingModal: any;
  	db_result: any;
  	
  	moduleForm: FormGroup;
  	submitAttempt: boolean = false;

  	first_name : string = '';
  	last_name : string = '';
  	email : string = '';
  	mobile : string = '';

  	country_id : string = '';
  	country_name : string = 'Select Country';
  	state_id : string = '';
  	state_name : string = 'Select State';
  	city_id : string = '';
  	city_name : string = 'Select City';

    is_state_show : number =  0;
    is_city_show : number =  0;
    address_id : string =  '';
    address_data : any =  '';
    item_count : number =  0;
    is_default : number =  0;

    is_billing_default : number =  0;
    is_shipping_default : number =  0;

  	constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public modalCtrl: ModalController, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
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

	    this.address_id = this.navParams.get('address_id');
	}

  	ionViewWillEnter()
  	{
  		localStorage.setItem('page_name', JSON.stringify('EditAddressPage'));
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
	    this.moduleService.view_address_data(mobile_access_token,this.address_id).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
		        this.address_data = db_result.data.user_address[0];
		        this.is_billing_default = this.address_data.is_billing_default;
		        this.is_shipping_default = this.address_data.is_shipping_default;
		        this.country_id = this.address_data.country_id;
		        this.country_name = this.address_data.country_name;
		        if(this.country_id != '')
		        {
		        	this.is_state_show = 1;
		        	this.state_id = this.address_data.state_id;
		        	this.state_name = this.address_data.state_name;
		        	if(this.state_id != '')
		        	{
		        		this.is_city_show = 1;
		        		this.city_id = this.address_data.city_id;
		        		this.city_name = this.address_data.city_name;
		        	}
		        }
		        this.item_count = 1;
	      	}
	      	else
	      	{
		        this.address_data = '';
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
    	console.log('ionViewDidLoad ViewAddressPage');
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

    eventHandler(keyCode,data)
  	{
	    if(keyCode == 13)
	    {
	      this.editAddress();
	    }
  	}

  	getBillingData(type)
  	{
  		this.is_billing_default = type;
  	}

  	getShippingData(type)
  	{
  		this.is_shipping_default = type;
  	}

  	editAddress() 
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
	        		'address_id': this.address_id,'first_name': this.moduleForm.value.first_name,'last_name': this.moduleForm.value.last_name,'company': this.moduleForm.value.company,'mobile': this.moduleForm.value.mobile,'address1': this.moduleForm.value.address1, 'address2': this.moduleForm.value.address2,'country_id': this.country_id,'state_id': this.state_id,'city_id': this.city_id,'pincode': this.moduleForm.value.pincode,'is_billing_default': this.is_billing_default,'is_shipping_default': this.is_shipping_default,'mobile_access_token': mobile_access_token
	      		};
	      		this.moduleService.edit_address('', { form_data }).then((data: any) => 
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
			              	this.navCtrl.pop();
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
}

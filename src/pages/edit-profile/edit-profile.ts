import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,AlertController } from 'ionic-angular';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http }  from '@angular/http';
import { ModuleProvider } from '../../providers/module-service';
import { Events } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})

export class EditProfilePage 
{
    loadingModal: any;
    db_result: any;
    
	moduleForm: FormGroup;
  	submitAttempt: boolean = false;

  	first_name : string = '';
  	last_name : string = '';
  	email : string = '';
    mobile : string = '';
  	gender : string = '';

  	constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public events: Events, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
	{
	    this.navCtrl= navCtrl;
	    this.http = http;
	    this.moduleForm = formBuilder.group
	    ({
	      	first_name: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(30),  Validators.required])],
	      	last_name: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(30),  Validators.required])],
	      	email: ['', Validators.compose([Validators.maxLength(100),  Validators.required, Validators.email])],
	      	mobile: ['', Validators.compose([Validators.minLength(10),Validators.maxLength(10),  Validators.required])]
	    });

        this.first_name = this.navParams.get('first_name');
        this.last_name = this.navParams.get('last_name');
      	this.email = this.navParams.get('email');
        this.mobile = this.navParams.get('mobile');
      	this.gender = this.navParams.get('gender');
        if(this.gender == '')
        {
          this.gender = 'male';
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
    }

    ionViewWillEnter()
    {
      localStorage.setItem('page_name', JSON.stringify('EditProfilePage'));
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

    getGender(type)
    {
      this.gender = type;
    }

  	eventHandler(keyCode,data)
  	{
	    if(keyCode == 13)
	    {
	      this.editProfile();
	    }
  	}

  	editProfile()
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
        		'first_name': this.moduleForm.value.first_name,'last_name': this.moduleForm.value.last_name,'email': this.moduleForm.value.email,'gender': this.gender,'mobile': this.moduleForm.value.mobile,'mobile_access_token': mobile_access_token
      		};
      		this.moduleService.edit_profile('', { form_data }).then((data: any) => 
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

		              	this.events.publish('side_menu_user_name:updated', user_name);
                        /*if(this.mobile == this.moduleForm.value.mobile)
                        {

                        }
                        else
                        {
                          this.navCtrl.push('ProfileMobileOtpPage',{ email:this.moduleForm.value.email,mobile:this.moduleForm.value.mobile });
                        }*/
                        if(data.is_change == '1')
                        {
                          this.navCtrl.setRoot('SigninPage');
                        }
                        else
                        {
                          this.navCtrl.setRoot('ViewProfilePage');
                        }
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

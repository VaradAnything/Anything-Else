import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,LoadingController,ToastController,AlertController } from 'ionic-angular';
import { Http }  from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ModuleProvider } from '../../providers/module-service';
import { DomSanitizer} from '@angular/platform-browser';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-view-address',
  templateUrl: 'view-address.html',
})

export class ViewAddressPage 
{
	loadingModal: any;
  	db_result: any;

  	address_data_array : any;
  	item_count: number;

	constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,public moduleService: ModuleProvider,public loadingCtrl: LoadingController,public toastCtrl: ToastController,private sanitizer: DomSanitizer, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
	{
	
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
  		localStorage.setItem('page_name', JSON.stringify('ViewAddressPage'));
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'none';
	        });
	    }

  		var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
  		var address_id = '';
  		this.loadingModal = this.loadingCtrl.create(
	    {
	      	spinner:'hide',
	      	content: '<img src="assets/icon/loader.gif">',
	      	//dismissOnPageChange: true,
                enableBackdropDismiss: true
	      	//duration: 1000
	    });
	    this.loadingModal.present();
	    this.moduleService.view_address_data(mobile_access_token,address_id).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	      		this.item_count = 1;
	        	this.address_data_array = db_result.data.user_address;
	        	this.loadingModal.dismiss();
	      	}
	      	else
	      	{
	        	this.address_data_array = '';
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
    	console.log('ionViewWillEnter ViewAddressPage');
  	}

  	addAddress()
  	{
  		this.navCtrl.push('AddAddressPage');
  	}

  	editAddress(address_id)
  	{
  		this.navCtrl.push('EditAddressPage',{ address_id:address_id });
  	}

  	deleteAddress(address_id)
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
	    this.moduleService.delete_address_data(mobile_access_token,address_id).then((db_result: any) => 
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

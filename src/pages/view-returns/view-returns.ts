import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,AlertController } from 'ionic-angular';
import { Http }  from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ModuleProvider } from '../../providers/module-service';
import { ScrollHideConfig } from '../../directives/scroll-hide/return-orders-scroll-hide';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-view-returns',
  templateUrl: 'view-returns.html',
})

export class ViewReturnsPage 
{
  	loadingModal: any;
  	db_result: any;
  	
	orders_data_array : any;
  	item_count: number;
  	total_wallet_amount : string =  '0';

  	footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 57 };

	constructor(public navCtrl: NavController, public navParams: NavParams,public moduleService: ModuleProvider,public loadingCtrl: LoadingController,public toastCtrl: ToastController, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
	{
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
  		localStorage.setItem('page_name', JSON.stringify('ViewReturnsPage'));
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
	    this.moduleService.view_all_return_orders(mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	      		this.item_count = 1;
	        	this.orders_data_array = db_result.data.user_order;
	        	this.total_wallet_amount = db_result.total_wallet_amount;
	        	this.loadingModal.dismiss();
	      	}
	      	else
	      	{
		        this.orders_data_array = '';
		        this.item_count = 0;
		        this.total_wallet_amount = '0';
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
    	console.log('ionViewDidLoad ViewAddressPage');
  	}

  	viewCategories()
  	{
  		//this.navCtrl.setRoot('TabsPage', { tabIndex : 1 });
  		this.navCtrl.setRoot('ViewMainCategoriesPage');
  	}

  	reloadPage()
  	{
  		this.ionViewDidLoad();
  	}

  	returnOrder(order_id,order_status,order_status_color,order_date)
  	{
  		this.navCtrl.push('ReturnOrderPage',{ order_id:order_id,order_status:order_status,order_status_color:order_status_color,order_date:order_date });
  	}
}

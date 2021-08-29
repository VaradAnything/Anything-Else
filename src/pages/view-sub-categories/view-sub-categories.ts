import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,AlertController } from 'ionic-angular';
import { Http }  from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ModuleProvider } from '../../providers/module-service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-view-sub-categories',
  templateUrl: 'view-sub-categories.html',
})

export class ViewSubCategoriesPage 
{
	loadingModal: any;
  	db_result: any;

  	category_data_array : any;
  	item_count: number;
  	cat_id: string = '';
  	sub_cat_id: string = '';

	constructor(public navCtrl: NavController, public navParams: NavParams,public moduleService: ModuleProvider,public loadingCtrl: LoadingController,public toastCtrl: ToastController, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
	{
		this.cat_id = this.navParams.get('cat_id');
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
  		localStorage.setItem('page_name', JSON.stringify('ViewSubCategoriesPage'));
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
  		var address_id = '';
  		this.loadingModal = this.loadingCtrl.create(
	    {
	      	spinner:'hide',
	      	content: '<img src="assets/icon/loader.gif">',
      		//dismissOnPageChange: true,
                enableBackdropDismiss: true
	    });
	    this.loadingModal.present();
	    this.moduleService.view_sub_categories(this.cat_id).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	      		this.item_count = 1;
	        	this.category_data_array = db_result.data;
	        	this.loadingModal.dismiss();
	      	}
	      	else
	      	{
	        	this.category_data_array = '';
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

  	toggleItems(category_title,sub_cat_id,is_sub_category,expand,position) 
  	{
  		if(is_sub_category == 0)
  		{
  			this.navCtrl.push('ViewCataloguePage',{ category_title:category_title,cat_id:this.cat_id,sub_cat_id:sub_cat_id,sub_sub_cat_id:'' });
  		}
  		else
  		{
  			for (var v in this.category_data_array) 
		    {
		      	if(v == position)
		      	{
		          	if(expand == 0)
		          	{
		            	this.category_data_array[v]['expand'] = '1';  
		          	}
		          	else if(expand == 1)
		          	{
		            	this.category_data_array[v]['expand'] = '0';
		          	}
		      	}
		      	else
		      	{
		        	this.category_data_array[v]['expand'] = '0';
		      	}
		    }
  		}
  	}

  	openCategories(category_title,sub_cat_id,sub_sub_cat_id)
  	{
  		this.navCtrl.push('ViewCataloguePage',{ category_title:category_title,cat_id:this.cat_id,sub_cat_id:sub_cat_id,sub_sub_cat_id:sub_sub_cat_id });
  	}
}

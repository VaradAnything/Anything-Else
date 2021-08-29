import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController, ViewController,AlertController } from 'ionic-angular';
import { Http }  from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ModuleProvider } from '../../providers/module-service';

@IonicPage()
@Component
({
  selector: 'page-view-city',
  templateUrl: 'view-city.html',
})

export class ViewCityPage 
{
	loadingModal: any;
  	db_result: any;

  	searchTerm: string = '';
  	city_data_array:any;
  	city_data_array1:any;
  	item_count : number;
    country_id: string = '';
  	state_id: string = '';

  	constructor(public navCtrl: NavController, public navParams: NavParams,public moduleService: ModuleProvider,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public view: ViewController,public alertCtrl: AlertController) 
  	{
  		this.country_id = this.navParams.get('country_id');
  		this.state_id = this.navParams.get('state_id');
  	}

    doRefresh(refresher)
    {
        setTimeout(() => 
        {
            this.ionViewWillEnter();
            refresher.complete();
        }, 1000);
    }

    reloadPage()
    {
      this.ionViewWillEnter();
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
      localStorage.setItem('page_name', JSON.stringify('ViewCityPage'));
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
	    this.moduleService.view_city_data(this.country_id,this.state_id,mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{
	        	this.city_data_array = db_result.data.city;
	        	this.city_data_array1 = db_result.data.city;
	        	this.item_count = 1;
            this.loadingModal.dismiss();
	      	}
	      	else
	      	{
	        	this.city_data_array = '';
	        	this.item_count = 0;
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

  	closeModal(city_id,city_name,count) 
  	{
	    var data = 
	    {
	      	city_id: city_id,
	      	city_name: city_name,
	      	count: count,
	    }
    	this.view.dismiss(data);
  	}

  	/*setFilteredItems() 
    {
        this.city_data_array = this.filterItems(this.searchTerm);
    }

    filterItems(searchTerm)
    {
        if(searchTerm == '')
        {
            this.city_data_array = this.city_data_array1;
        }
        return this.city_data_array.filter((item) => 
        {
            return item.city_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });   
    }*/

    filterItems(ev)
    {
        var search_term = ev.target.value;
        this.city_data_array = this.city_data_array1;
        if (search_term && search_term.trim() != '') 
        {
            this.city_data_array = this.city_data_array.filter((item) => 
            {
                return (item.city_name.toLowerCase().indexOf(search_term.toLowerCase()) > -1);
            });  
        }  
    }
}

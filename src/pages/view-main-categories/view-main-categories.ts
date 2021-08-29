import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,LoadingController,ToastController,AlertController } from 'ionic-angular';
import { Http }  from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ModuleProvider } from '../../providers/module-service';
import { ScrollHideConfig } from '../../directives/scroll-hide/main-category-scroll-hide';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-view-main-categories',
  templateUrl: 'view-main-categories.html',
})

export class ViewMainCategoriesPage 
{
	loadingModal: any;
  	db_result: any;
  	
	category_data_array : any;
  	item_count: number;

    cart_items_count: number;
  	count: number = 0;

    footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 57 };

	constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,public moduleService: ModuleProvider,public loadingCtrl: LoadingController,public toastCtrl: ToastController, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
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

	openTabsPage(type)
    {
        if(type == 1)
        {
            this.navCtrl.setRoot('HomePage');
        }
        else if(type == 2)
        {
            //this.navCtrl.setRoot('ViewMainCategoriesPage');
            //this.ionViewDidLoad();
        }
        else if(type == 3)
        {
            this.navCtrl.setRoot('ViewMyCartPage');
        }
        else if(type == 4)
        {
            this.navCtrl.setRoot('AccountPage');
        }
    }

	openNotification()
    {
        let options: NativeTransitionOptions = 
        {
            direction: 'left',
            duration: 400,
            slowdownfactor: -1,
            iosdelay: 50
        };
        this.nativePageTransitions.slide(options);
        this.navCtrl.push('NotificationPage');
    }

  	ionViewWillEnter()
  	{
  		localStorage.setItem('page_name', JSON.stringify('ViewMainCategoriesPage'));
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'flex';
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
        this.moduleService.view_main_categories(mobile_access_token).then((db_result: any) => 
        {
            this.db_result = db_result;
            if(db_result.status_code == 200)
            { 
                this.item_count = 1;
                localStorage.setItem('main_categories_data', JSON.stringify(1));
                localStorage.setItem('category_data_array', JSON.stringify(db_result.data));
                this.category_data_array = db_result.data;

                for (var v in this.category_data_array) 
                {
                    this.count = this.count + 1;
                }

                if(db_result.cart_items_count == 0)
                {
                    if(JSON.parse(localStorage.getItem('login_type')) == 0)
                    {
                        this.cart_items_count = JSON.parse(localStorage.getItem('cart_items_count'));
                    }
                    else
                    {
                        localStorage.setItem('cart_items_count', JSON.stringify(0));
                        this.cart_items_count = 0;
                    }
                }
                else
                {
                    localStorage.setItem('cart_items_count', JSON.stringify(db_result.cart_items_count));
                    this.cart_items_count = db_result.cart_items_count;
                }
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

  	ionViewWillLeave()
  	{
  		this.loadingModal.dismiss();
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'none';
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
	            elements[key].style.display = 'flex';
	        });
	    }
  	}

  	openSubCategories(cat_id,category_title,is_sub_category)
  	{
  		if(is_sub_category == 0)
  		{
  			this.navCtrl.push('ViewCataloguePage',{ category_title:category_title,cat_id:cat_id,sub_cat_id:'',sub_sub_cat_id:'' });
  		}
  		else
  		{
  			this.navCtrl.push('ViewSubCategoriesPage',{ cat_id:cat_id });
  		}
  	}
}

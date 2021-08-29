import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,AlertController } from 'ionic-angular';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http }  from '@angular/http';
import { ModuleProvider } from '../../providers/module-service';

@IonicPage()
@Component
({
  selector: 'page-view-review',
  templateUrl: 'view-review.html',
})

export class ViewReviewPage 
{
	loadingModal: any;
  	db_result: any;
  	
	moduleForm: FormGroup;
  	submitAttempt: boolean = false;

  	review_data_array: any = '';
  	item_count: number = 0;
  	product_seo_url : string = '';

  	constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public alertCtrl: AlertController) 
	{
	    this.navCtrl= navCtrl;
	    this.http = http;
	    this.moduleForm = formBuilder.group
	    ({
	      	review_title: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(50),  Validators.required])],
	      	review_comment: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(100),  Validators.required])],
	      	rating: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(5),  Validators.required])]
	    });

	    //this.product_seo_url = this.navParams.get('product_seo_url');
	    this.product_seo_url = 'apara-alloy-jewel-set-gold';
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
  		localStorage.setItem('page_name', JSON.stringify('ViewReviewPage'));
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
	    this.moduleService.view_review(this.product_seo_url,mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	        	this.review_data_array = db_result.data.product_review;
	        	this.item_count = 1;
	      	}
	      	else
	      	{
		        this.review_data_array = '';
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
  	}

  	eventHandler(keyCode,data)
  	{
	    if(keyCode == 13)
	    {
	      this.addReview();
	    }
  	}

  	addReview()
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
        		'review_title': this.moduleForm.value.review_title,'review_comment': this.moduleForm.value.review_comment,'rating': this.moduleForm.value.rating,'product_seo_url': this.product_seo_url,'mobile_access_token': mobile_access_token
      		};
      		this.moduleService.add_review('', { form_data }).then((data: any) => 
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
  	}
}

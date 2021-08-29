import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,LoadingController,ToastController, Platform, ActionSheetController,AlertController } from 'ionic-angular';
import { Http }  from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ModuleProvider } from '../../providers/module-service';

import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Observable } from 'rxjs/Observable';
import { ChangeDetectorRef } from '@angular/core';
import { ScrollHideConfig } from '../../directives/scroll-hide/search-catalogue-scroll-hide';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Events } from 'ionic-angular';

@IonicPage()
@Component
({
  selector: 'page-view-search-catalogue',
  templateUrl: 'view-search-catalogue.html',
})

export class ViewSearchCataloguePage 
{
  	loadingModal: any;
  	db_result: any;

  	catalogue_data_array : any = '';
  	catalogue_data_array1 : any = '';
  	filter_data_array : any;
  	item_count: number;

  	play_animation : number = 0;

  	category_title: string = '';
  	cat_id: string = '';
  	sub_cat_id: string = '';
  	sub_sub_cat_id: string = '';
  	filter_expression: string = '';
  	q: string = '';
  	sort_by: string = '1';
  	page:number = 1;
  	stop:number = 0;

  	price_min_value : number = 0;
	price_max_value : number = 0;

	min_value : number = 0;
	max_value : number = 2000;

	is_filter_show : number = 0;
	price : string = '';

	is_more_data : number = 1;

	old_filter : any;

	//price_filter_data: any = { lower: 0, upper: 2000 };

	is_search_show: number = 1;
    product_search :string = '';

    public cssClass : string = '';

    public cssClass1 : string = '';

    matches: string[];
    isRecording = false;

    total_items_in_cart: number = 0;
    login_type: number = 0;

    footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 57 };

	constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,public moduleService: ModuleProvider,public loadingCtrl: LoadingController,public toastCtrl: ToastController, private speechRecognition: SpeechRecognition, private platform: Platform, private cd: ChangeDetectorRef, private nativePageTransitions: NativePageTransitions,public actionsheetCtrl: ActionSheetController,public alertCtrl: AlertController,public events: Events) 
	{
		this.q = this.navParams.get('product_search');
		this.product_search = this.navParams.get('product_search');
	}

	sortBy() 
	{
    	let actionSheet = this.actionsheetCtrl.create
    	({
	      	title: 'Sort By',
	      	cssClass: 'action-sheets-basic-page',
	      	buttons: 
	      	[
		        {
		          	text: 'New',
		          	handler: () => 
		          	{
		          		this.sort_by = '1';
		          		this.page = 1;
		          		this.item_count = 2;
		            	this.catalogue_data_array = '';
		            	this.catalogue_data_array1 = '';
		            	this.ionViewDidLoad();
		          	}
		        },
		        {
		          	text: 'Price Low to High',
		          	handler: () => 
		          	{
		            	this.sort_by = '2';
		            	this.item_count = 2;
		            	this.page = 1;
		            	this.q = this.product_search;
		            	this.catalogue_data_array = '';
		            	this.catalogue_data_array1 = '';
		            	this.ionViewDidLoad();
		          	}
		        },
		        {
		          	text: 'Price High to Low',
		          	handler: () => 
		          	{
		            	this.sort_by = '3';
		            	this.item_count = 2;
		            	this.page = 1;
		            	this.q = this.product_search;
		            	this.catalogue_data_array = '';
		            	this.catalogue_data_array1 = '';
		            	this.ionViewDidLoad();	
		          	}
		        },
		        {
		          	text: 'A to Z',
		          	handler: () => 
		          	{
		            	//this.sort_by = '4';
		            	//this.item_count = 2;
		            	//this.catalogue_data_array = '';
		            	//this.catalogue_data_array1 = '';
		            	//this.ionViewDidLoad();
		            	this.catalogue_data_array.sort(this.dynamicSort("product_name"));
		            	this.catalogue_data_array1.sort(this.dynamicSort("product_name"));
		          	}
		        },
		        {
		          	text: 'Z to A',
		          	handler: () => 
		          	{
		            	//this.sort_by = '5';
		            	//this.item_count = 2;
		            	//this.catalogue_data_array = '';
		            	//this.ionViewDidLoad();
		            	this.catalogue_data_array.sort(this.dynamicSort("-product_name"));
		            	this.catalogue_data_array1.sort(this.dynamicSort("-product_name"));
		          	}
		        },
		        {
		          	text: 'Reset',
		          	handler: () => 
		          	{
		            	this.sort_by = '1';
		            	this.item_count = 2;
		            	this.catalogue_data_array = '';
		            	this.catalogue_data_array1 = '';
		            	this.page = 1;
		            	this.getCatalogue(0,0);
		            	//this.ionViewDidLoad();

		          	}
		        }
	      	]
    	});
    	actionSheet.present();
  	}

  	dynamicSort(property) 
    {
        var sortOrder = 1;

        if(property[0] === "-") 
        {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function (a,b) 
        {
            if(sortOrder == -1)
            {
                return b[property].localeCompare(a[property]);
            }
            else
            {
                return a[property].localeCompare(b[property]);
            }        
        }
    }


	stopListening() 
    {
        this.speechRecognition.stopListening().then(() => 
        {
            this.isRecording = false;
        });
    }
 
    getPermission() 
    {
        this.speechRecognition.hasPermission().then((hasPermission: boolean) => 
        {
            if (!hasPermission) 
            {
              this.speechRecognition.requestPermission();
            }
            this.startListening();
        });
    }
 
    startListening() 
    {
        let options = 
        {
            language: 'en-US'
        }
        
        this.speechRecognition.startListening().subscribe(matches => 
        {
            this.matches = matches;
            this.product_search = this.matches[0];
            this.cd.detectChanges();
        });
        this.isRecording = true;
        //this.goToSearch();
    }

	doRefresh(refresher)
	{
		setTimeout(() => 
		{
			this.product_search = '';
        	this.q = '';
      		this.ionViewDidLoad();
      		refresher.complete();
    	}, 1000);
	}

	searchShow(type)
    {
        this.is_search_show = type;
        if(type == 1)
        {
          this.cssClass = 'search_height_add';
        }
        else
        {
          this.cssClass = 'search_height_remove';
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
	    this.getCatalogue(this.filter_expression,0);
  	}

  	ionViewWillEnter()
  	{
  		localStorage.setItem('page_name', JSON.stringify('ViewCataloguePage'));
  		let elements = document.querySelectorAll(".tabbar");

	    if (elements != null) 
	    {
	        Object.keys(elements).map((key) => 
	        {
	            elements[key].style.display = 'none';
	        });
	    }
	    this.login_type = +(JSON.parse(localStorage.getItem('login_type')));
	    if(JSON.parse(localStorage.getItem('login_type')) == 1)
	    {
	    
		    let pos = localStorage.getItem('pos');
			let variant_pos = localStorage.getItem('variant_pos');
		    if(localStorage.getItem('pos') != '' )
		    {
		    	console.log(localStorage.getItem('update'));
		    	if(JSON.parse(localStorage.getItem('update')) == 1)
		    	{
					var product_variant_seo_url = JSON.parse(localStorage.getItem('product_variant_seo_url'));
					console.log(product_variant_seo_url + 'hie');
					console.log(this.catalogue_data_array[pos]['product_variant_seo_url'] + 'h');
					if(variant_pos != '')
					{
		    			this.catalogue_data_array[pos]['variant_data'][variant_pos]['is_wishlisted'] = 1;
					}
		    		if(this.catalogue_data_array[pos]['product_variant_seo_url'] == product_variant_seo_url)
		    		{
				    	this.catalogue_data_array[pos]['is_wishlisted'] = 1;
		    		}
		    		else
		    		{
		    			this.catalogue_data_array[pos]['is_wishlisted'] = 0;
		    		}
			        localStorage.setItem('pos','');
			        localStorage.setItem('variant_pos','');
			        localStorage.setItem('update', JSON.stringify(0));
		        }
		        else if(JSON.parse(localStorage.getItem('update')) == 0)
		        {
		        	var product_variant_seo_url = JSON.parse(localStorage.getItem('product_variant_seo_url'));
		        	if(variant_pos != '')
					{
		    			this.catalogue_data_array[pos]['variant_data'][variant_pos]['is_wishlisted'] = 0;
					}
		        	/*if(this.catalogue_data_array[pos]['product_variant_seo_url'] == product_variant_seo_url)
		    		{
				    	this.catalogue_data_array[pos]['is_wishlisted'] = 0;
		    		}*/
					this.catalogue_data_array[pos]['is_wishlisted'] = 0;
		        	localStorage.setItem('pos','');
		        	localStorage.setItem('variant_pos','');

		        }
		    }
		    /*else
		    {
		    	this.catalogue_data_array[pos]['is_wishlisted'] = 0;
		        localStorage.removeItem('pos');
		    }*/
	    }
  	}

  	ionViewWillLeave()
  	{
  		this.product_search = '';
        this.q = '';
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

  	resetSearch()
    {
        this.product_search = '';
        this.q = '';
        //this.getSearchProduct();
        this.sort_by = '1';
		this.item_count = 2;
		this.page = 1;
		//this.price_min_value = 0;
        //this.price_max_value = 0;
		this.catalogue_data_array = '';
		this.catalogue_data_array1 = '';
		this.ionViewDidLoad();
    }

  	eventHandler(keyCode,data)
    {
        if(keyCode == 13)
        {
            if(data == '')
            {

            }
            else
            {
                this.goToSearch();
            }
           
        }
    }

  	goToSearch()
  	{
  		this.q = this.product_search;
  		//if(this.q != '')
  		//{
  			this.catalogue_data_array = '';
  			this.catalogue_data_array1 = '';
        	this.filter_data_array = '';
        	//this.price_min_value = 0;
        	//this.price_max_value = 0;
        	this.item_count = 2;
        	this.page = 1;
  			this.ionViewDidLoad();
  		//}
  	}

  	getPrice()
  	{
  		//this.price_min_value = this.price_filter_data.lower;
  		//this.price_max_value = this.price_filter_data.upper;
  	}

  	getCatalogue(filter_expression,source_type)
  	{
  		if(source_type == 1)
  		{
  			//this.product_search = '';
  			//this.q = '';
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

	    this.price = this.price_min_value + '-' + this.price_max_value;
	    this.moduleService.view_catalogue_data(this.cat_id,this.sub_cat_id,this.sub_sub_cat_id,this.filter_expression,this.q,this.sort_by,this.page,this.price,mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	      		this.item_count = 1;
	      		if(db_result.data.product == '')
	      		{
	      			if(source_type == 1)
		      		{
		      			this.filter_data_array = '';
			            this.catalogue_data_array = '';
			            this.catalogue_data_array1 = '';
		      		}
	      		}
	      		

      			if(this.page == 1)
		        {
		          this.old_filter = db_result.data.filter_list;
		        }

		        //if(db_result.data.filter_list == '')
		        if(db_result.data.product == '')
		        {
		          	this.is_filter_show = 0;
		          	this.filter_data_array = this.old_filter;
		        }
		        else
		        {
		          	this.is_filter_show = 1;
		          	this.filter_data_array = db_result.data.filter_list;
		        }
		        
		        this.is_more_data = db_result.is_more_data;
		        if(db_result.data.product != '')
		        {
		          	if(this.catalogue_data_array != '' && this.catalogue_data_array1 != '')
		          	{
		            	this.catalogue_data_array = this.catalogue_data_array.concat(db_result.data.product);
		            	this.catalogue_data_array1 = this.catalogue_data_array1.concat(db_result.data.product);
		          	}
		          	else
		          	{
		            	this.catalogue_data_array = db_result.data.product;
		            	this.catalogue_data_array1 = db_result.data.product;
		          	}
		          	this.stop = 0;
		        }
		        else
		        {
		          	this.stop = 1;
		        }

	        	//this.catalogue_data_array = db_result.data.product;
	        	//this.catalogue_data_array1 = db_result.data.product;
	        	this.cssClass1 = "animated zoomIn";
	        	//this.filter_data_array = db_result.data.filter_list;
	        	this.price_min_value = db_result.data.price.min_value;
	        	this.price_max_value = db_result.data.price.max_value;
	        	this.min_value = db_result.data.actual_min_value;
	        	this.max_value = db_result.data.actual_max_value;
	        	if(mobile_access_token == '')
	        	{
	        		if(JSON.parse(localStorage.getItem('cart_items_count')) == '' || JSON.parse(localStorage.getItem('cart_items_count')) == null)
	                {
	                	localStorage.setItem('cart_items_count', JSON.stringify(0));
	                	this.total_items_in_cart = 0;
	                }
	                else
	                {
	                	this.total_items_in_cart = JSON.parse(localStorage.getItem('cart_items_count'));
	                }
	        	}
	        	else
	        	{
	        		this.total_items_in_cart = db_result.cart_items_count;
	        	}
	        	
	        	this.loadingModal.dismiss();
	      	}
	      	else
	      	{
	        	this.catalogue_data_array = '';
	        	this.catalogue_data_array1 = '';
	        	this.filter_data_array = '';
	        	this.price_min_value = 0;
	        	this.price_max_value = 0;
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

  	doInfinite(infiniteScroll) 
  	{ 
	    setTimeout(() => 
	    {
	      	if(this.stop == 0 && this.is_more_data == 1)
	      	{
	        	this.page++;
	        	this.getCatalogue(this.filter_expression,0);
	        	infiniteScroll.complete();
	        	//this.stop = 1;
	      	}
	      	else
	      	{
	        	infiniteScroll.complete();
	      	}
	    }, 500);
  	}

  	showFilter()
  	{
  		let modal = this.modalCtrl.create('FilterPage', { filter_data: this.filter_data_array,filter_reset: 0,price_min_value: this.price_min_value,price_max_value: this.price_max_value});
      	modal.onDidDismiss(data => 
      	{
	        
      	});
      	modal.present();
  	}

  	filter() 
    {
      	let modal = this.modalCtrl.create('FilterPage', { filter_data: this.filter_data_array,filter_reset: 0,price_min_value: this.price_min_value,price_max_value: this.price_max_value,min_value: this.min_value,max_value: this.max_value});
      	modal.onDidDismiss(data => 
      	{
	        if(data) 
	        {
	          	if(data.page == 1)
          		{
		            this.page = data.page;
		            //this.product_search = '';
					//this.q = '';
					this.catalogue_data_array = '';
	  				this.catalogue_data_array1 = '';
	  				this.filter_data_array = '';
	  				this.item_count = 1;
					this.filter_expression = data.filter_expression;
					this.price_min_value = data.price_min_value;
					this.price_max_value = data.price_max_value;
					this.getCatalogue(this.filter_expression,1);
          		}
	        }
      	});
      	modal.present();
    }

    updateWishlist(position,product_seo_url,product_variant_seo_url,is_wishlisted,type)
  	{
  		if(JSON.parse(localStorage.getItem('login_type')) == 0)
  		{
  			let toast = this.toastCtrl.create
	        ({
	            message: 'Please login to add product in wishlist',
	            duration: 1500,
	            position: 'bottom',
	        });
	        toast.present();
	        this.navCtrl.setRoot('SigninPage');
  		}
  		else
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
		    this.moduleService.update_wishlists(product_seo_url,product_variant_seo_url,type,mobile_access_token).then((db_result: any) => 
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
			        if(is_wishlisted == 0)
			        {
			        	this.catalogue_data_array[position]['is_wishlisted'] = 1;
			        	this.catalogue_data_array1[position]['is_wishlisted'] = 1;
			        }
			        else
			        {
			        	this.catalogue_data_array[position]['is_wishlisted'] = 0;
			        	this.catalogue_data_array1[position]['is_wishlisted'] = 0;
			        }
	 		        //this.ionViewDidLoad();
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
  	}

  	openProductDetails(product_variant_seo_url,i)
  	{
  		localStorage.setItem('product_variant_seo_url', JSON.stringify(product_variant_seo_url));
  		localStorage.setItem('pos', JSON.stringify(i));
  		this.navCtrl.push('ViewProductDetailsPage',{ product_variant_seo_url:product_variant_seo_url });
  	}

  	onChangeVariant(product_variant_seo_url,photo1_size_medium,product_mrp,product_price,discount_per,is_wishlisted,index,index1)
  	{
		for (var v in this.catalogue_data_array[index]['variant_data']) 
      	{
	        this.catalogue_data_array[index]['variant_data'][v]['is_default'] = 0;
	        localStorage.setItem('variant_pos', JSON.stringify(index1));
      	}
  		this.catalogue_data_array[index]['variant_data'][index1]['is_default'] = 1;
  		this.catalogue_data_array[index]['is_wishlisted'] = is_wishlisted;
  		this.catalogue_data_array[index]['photo1_size_medium'] = photo1_size_medium;
  		this.catalogue_data_array[index]['product_mrp'] = product_mrp;
  		this.catalogue_data_array[index]['product_price'] = product_price;
  		this.catalogue_data_array[index]['discount_percent'] = discount_per;
  		this.catalogue_data_array[index]['product_variant_seo_url'] = product_variant_seo_url;


		for (var v in this.catalogue_data_array1[index]['variant_data']) 
      	{
	        this.catalogue_data_array1[index]['variant_data'][v]['is_default'] = 0;
	        localStorage.setItem('variant_pos', JSON.stringify(index1));
      	}
  		this.catalogue_data_array1[index]['variant_data'][index1]['is_default'] = 1;
  		this.catalogue_data_array1[index]['is_wishlisted'] = is_wishlisted;
  		this.catalogue_data_array1[index]['photo1_size_medium'] = photo1_size_medium;
  		this.catalogue_data_array1[index]['product_mrp'] = product_mrp;
  		this.catalogue_data_array1[index]['product_price'] = product_price;
  		this.catalogue_data_array1[index]['discount_percent'] = discount_per;
  		this.catalogue_data_array1[index]['product_variant_seo_url'] = product_variant_seo_url;
  	}

  	addToCart(index,temp_photo1_size_medium,product_min_qty,product_max_qty)
  	{
  		var product_id = '';
  		var category_id = '';
  		var product_variant_id = '';
  		var photo1_size_medium = '';
  		var product_variant_name = '';
  		var product_seo_url = '';
  		var product_variant_seo_url = '';
  		var product_mrp = '';
  		var product_price = '';
  		for (var v in this.catalogue_data_array[index]['variant_data']) 
      	{
	        if(this.catalogue_data_array[index]['variant_data'][v]['is_default'] == '1')
	        {
	        	product_id = this.catalogue_data_array[index]['variant_data'][v]['product_id'];
	        	category_id = this.catalogue_data_array[index]['category_id'];
	        	product_variant_id = this.catalogue_data_array[index]['variant_data'][v]['id'];
	        	photo1_size_medium = this.catalogue_data_array[index]['photo1_size_medium'];
	        	product_variant_name = this.catalogue_data_array[index]['product_name'];
	        	product_seo_url = this.catalogue_data_array[index]['product_seo_url'];
	        	product_variant_seo_url = this.catalogue_data_array[index]['variant_data'][v]['product_variant_seo_url'];
	        	product_mrp = this.catalogue_data_array[index]['variant_data'][v]['product_mrp'];
	        	product_price = this.catalogue_data_array[index]['variant_data'][v]['product_price'];
	        }
      	}

		for (var v in this.catalogue_data_array1[index]['variant_data']) 
      	{
	        if(this.catalogue_data_array1[index]['variant_data'][v]['is_default'] == '1')
	        {
	        	product_id = this.catalogue_data_array1[index]['variant_data'][v]['product_id'];
	        	category_id = this.catalogue_data_array1[index]['category_id'];
	        	product_variant_id = this.catalogue_data_array1[index]['variant_data'][v]['id'];
	        	photo1_size_medium = this.catalogue_data_array1[index]['photo1_size_medium'];
	        	product_variant_name = this.catalogue_data_array1[index]['product_name'];
	        	product_seo_url = this.catalogue_data_array1[index]['product_seo_url'];
	        	product_variant_seo_url = this.catalogue_data_array1[index]['variant_data'][v]['product_variant_seo_url'];
	        	product_mrp = this.catalogue_data_array1[index]['variant_data'][v]['product_mrp'];
	        	product_price = this.catalogue_data_array1[index]['variant_data'][v]['product_price'];
	        }
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
	    this.moduleService.add_to_cart(product_seo_url,product_variant_seo_url,product_min_qty,mobile_access_token).then((db_result: any) => 
	    {
	      	this.db_result = db_result;
	      	if(db_result.status_code == 200)
	      	{ 
	      		if(JSON.parse(localStorage.getItem('login_type')) == 0)
			  	{
			  		if(db_result.total_available_quantity > 1)
			  		{
			  			var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

				  		if(without_login_cart_data_array == '' || without_login_cart_data_array == null)
			            {
					  		without_login_cart_data_array.push
				            ({
				            	product_id:  product_id,
				            	category_id:  category_id,
				            	product_variant_id:  product_variant_id,
				                product_image:  photo1_size_medium,
				                product_name : product_variant_name,
				                product_seo_url:  product_seo_url,
				                product_variant_seo_url : product_variant_seo_url,
				                product_variant_mrp : product_mrp,
				                product_variant_price:  product_price,
				                product_variant_quantity:  1,
				                product_variant_one : '',
				                product_variant_two : '',
				            });
				            localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
				            let toast = this.toastCtrl.create
				            ({
				                message: 'Product added to cart successfully',
				                duration: 1500,
				                position: 'bottom',
				            });
				            toast.present();
				        }
				        else
				        {
				        	var type = 0;
			              	for (var v in without_login_cart_data_array) 
			              	{
				                var without_login_cart_data = without_login_cart_data_array[v];
				                var product_variant_seo_url1 = without_login_cart_data.product_variant_seo_url;
				                if(product_variant_seo_url1 == product_variant_seo_url)
				                {
				                  	var temp_total_qty = +without_login_cart_data.product_variant_quantity;
				                  	if(temp_total_qty < db_result.total_available_quantity)
				                  	{
				                      	without_login_cart_data['product_variant_quantity'] = (+temp_total_qty) + 1;
				                      	localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
				                      	//this.navCtrl.setRoot('TabsPage', { tabIndex:1}); 
				                      	let toast = this.toastCtrl.create
				                      	({
				                          	message: 'Product updated to cart successfully',
				                          	duration: 1500,
				                          	position: 'bottom',
				                      	});
				                      	toast.present();
				                      	type = 1;
				                      	break;
				                  	}
				                  	else
				                  	{
					                    let toast = this.toastCtrl.create
					                    ({
					                        message: 'No more stock available',
					                        duration: 1500,
					                        position: 'bottom',
					                    });
					                    toast.present();
					                    //this.navCtrl.setRoot('SigninPage');
					                    type = 1;
					                    break;
				                  	}
				                }
			              	}
			              	if(type == 0)
			              	{
			                  	if(db_result.total_available_quantity > 1)
			                  	{
				                    without_login_cart_data_array.push
				                    ({
				                    	product_id:  product_id,
						            	category_id:  category_id,
						            	product_variant_id:  product_variant_id,
						                product_image:  photo1_size_medium,
						                product_name : product_variant_name,
						                product_seo_url:  product_seo_url,
						                product_variant_seo_url : product_variant_seo_url,
						                product_variant_mrp : product_mrp,
						                product_variant_price:  product_price,
						                product_variant_quantity:  1,
						                product_variant_one : '',
						                product_variant_two : '',
				                    });
				                    localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
				                    //this.navCtrl.setRoot('TabsPage', { tabIndex:1}); 
				                    let toast = this.toastCtrl.create
				                    ({
				                        message: 'Product added to cart successfully.',
				                        duration: 1500,
				                        position: 'bottom',
				                    });
				                    toast.present();
			                  	}
			              	}
				        }
			  		}
			  		else
			  		{
			  			let toast = this.toastCtrl.create
				        ({
				            message: 'No more stock available',
				            duration: 1500,
				            position: 'bottom',
				        });
				        toast.present();
			  		}

			  		var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

			  		var temp_total_qty = 0;
			  		for (var v in without_login_cart_data_array) 
			      	{
			      		var cart_data = without_login_cart_data_array[v];
				        temp_total_qty = (+temp_total_qty) + 1;
			      	}
			      	this.total_items_in_cart = +(temp_total_qty);
			      	localStorage.setItem('cart_items_count', JSON.stringify(temp_total_qty));
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
			        if(db_result.cart_items_count == '' || db_result.cart_items_count == null)
	                {
	                	localStorage.setItem('cart_items_count', JSON.stringify(0));
	                	this.total_items_in_cart = 0;
	                }
	                else
	                {
	                	localStorage.setItem('cart_items_count', JSON.stringify(db_result.cart_items_count));
	                	this.total_items_in_cart = db_result.cart_items_count;
	                }
			        this.events.publish('cart:updated', db_result.cart_items_count);
			        localStorage.setItem('play_animation', JSON.stringify(1));
	    			this.play_animation = JSON.parse(localStorage.getItem('play_animation'));
			  	}
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

	myCart()
  	{
  		//this.navCtrl.setRoot('TabsPage', { tabIndex : 2 });
  		this.navCtrl.setRoot('ViewMyCartPage'); 
  	}

  	addToCartWithoutLogin()
  	{
  		let toast = this.toastCtrl.create
        ({
            message: 'Please Login For Add To Cart',
            duration: 1500,
            position: 'bottom',
        });
        toast.present();
  	}

  	filterItems(ev)
  	{
  		var search_term = ev.target.value;
  		//this.q = ev.target.value;
	    this.catalogue_data_array = this.catalogue_data_array1;        	
	     this.q = ev.target.value;
	    if (search_term && search_term.trim() != '') 
	    {
	        this.catalogue_data_array = this.catalogue_data_array.filter((item) => 
	        {
	           return (item.product_name.toLowerCase().indexOf(search_term.toLowerCase()) > -1);
	        });
	    }
  		else
	    {
		    this.q = '';
	  		this.product_search = '';
	  		this.page = 1;
	  		console.log("cleared");
	  		this.catalogue_data_array = '';
	  		this.catalogue_data_array1 = '';
	  		this.getCatalogue(this.filter_expression,0);
	    }
  	}

  	onCancel()
  	{
  		this.q = '';
  		this.product_search = '';
  		console.log("clicked cancel");
  		this.page = 1;
  		this.catalogue_data_array = '';
  		this.catalogue_data_array1 = '';
  		this.getCatalogue(this.filter_expression,0);
  	}

  	home()
  	{
  		this.navCtrl.setRoot('HomePage');
  	}
}

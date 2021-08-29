import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,LoadingController,ToastController, Platform,AlertController } from 'ionic-angular';
import { Http }  from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { ModuleProvider } from '../../providers/module-service';
import { Content } from 'ionic-angular';

import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Observable } from 'rxjs/Observable';
import { ChangeDetectorRef } from '@angular/core';
import { ScrollHideConfig } from '../../directives/scroll-hide/home-scroll-hide';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage 
{
    loadingModal: any;
    db_result: any;

    slider_data_array : any;
    banner_data_array : any;
    best_selling_product_data_array : any;    
    featured_product_data_array : any;
    new_arrival_product_data_array : any;
    item_count: number = 0;
    min_value: number = 0;
    max_value: number = 2000;
    bg_image1: any;
    bg_image2: any;
    bg_image3: any;
    banner_image1: any;
    banner_image2: any;
    banner_image3: any;
    banner_image4: any;
    banner_image5: any;

    banner_category_id_1: any;
    banner_category_id_2: any;
    banner_category_id_3: any;
    banner_category_id_4: any;
    banner_category_id_5: any;

    banner_sub_category_id_1: any;
    banner_sub_category_id_2: any;
    banner_sub_category_id_3: any;
    banner_sub_category_id_4: any;
    banner_sub_category_id_5: any;

    banner_sub_sub_category_id_1: any;
    banner_sub_sub_category_id_2: any;
    banner_sub_sub_category_id_3: any;
    banner_sub_sub_category_id_4: any;
    banner_sub_sub_category_id_5: any;



    total_address_results: any;

    structure: any = { lower: 10, upper: 500 };

    cart_items_count: number;
    is_search_show: number = 1;
    is_show_header: number = 1;
    is_show_footer: number = 1;
    product_search :string = '';

    bg_image1_color :string = '#000';
    bg_image2_color :string = '#000';

    latitude :number;
    longitude :number;

    public cssClass : string;

    public cssClass1 : string = '';
    public cssClass2 : string = '';

    category_data_array : any;    
    category_count: number = 0;

    @ViewChild(Content) content: Content;

    matches: string[];
    isRecording = false;

    footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 57 };

    constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,public moduleService: ModuleProvider,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public events: Events, private speechRecognition: SpeechRecognition, private plt: Platform, private cd: ChangeDetectorRef, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
    {
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
        //this.goToSearchCataloguePage();
    }

    doRefresh(refresher)
    {
        setTimeout(() => 
        {
            this.ionViewDidLoad();
            refresher.complete();
        }, 1000);
    }

    onScroll($event)
    {
        if($event.scrollTop > 0)
        {
            //this.is_show_header = 0;
            //this.is_show_footer = 0;
            //this.content.resize();
        }
        else
        {
            
        }
    }

    showSearch(type)
    {
        this.is_search_show = type;
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
                this.goToSearchCataloguePage();
            }
           
        }
    }

    resetSearch()
    {
        this.product_search = '';
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

    goToSearchCataloguePage()
    {
        if(this.product_search != '')
        {
            this.navCtrl.push('ViewSearchCataloguePage',{ product_search:this.product_search });
        }
    }

    openTabsPage(type)
    {
        if(type == 1)
        {
            //this.navCtrl.setRoot('HomePage');
            //this.ionViewDidLoad();
        }
        else if(type == 2)
        {
            this.navCtrl.setRoot('ViewMainCategoriesPage');
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

    ionViewWillEnter()
    {

        localStorage.setItem('page_name', JSON.stringify('HomePage'));
        let elements = document.querySelectorAll(".tabbar");

        if (elements != null) 
        {
            Object.keys(elements).map((key) => 
            {
                elements[key].style.display = 'flex';
            });
        }
        localStorage.setItem('page_name', JSON.stringify('HomePage'));
        this.cart_items_count = JSON.parse(localStorage.getItem('cart_items_count'));
    }

    ionViewWillLeave()
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

        if(JSON.parse(localStorage.getItem('home_data')) == 1)
        {
            this.bg_image1_color = JSON.parse(localStorage.getItem('bg_image1_color'));
            this.bg_image2_color = JSON.parse(localStorage.getItem('bg_image2_color'));
            this.bg_image1 = JSON.parse(localStorage.getItem('bg_image1'));
            this.bg_image2 = JSON.parse(localStorage.getItem('bg_image2'));
            this.bg_image3 = JSON.parse(localStorage.getItem('bg_image3'));
            this.slider_data_array = JSON.parse(localStorage.getItem('slider_data_array'));
            this.banner_image1 = JSON.parse(localStorage.getItem('banner_image1'));
            this.banner_image2 = JSON.parse(localStorage.getItem('banner_image2'));
            this.banner_image3 = JSON.parse(localStorage.getItem('banner_image3'));
            this.banner_image4 = JSON.parse(localStorage.getItem('banner_image4'));
            this.banner_image5 = JSON.parse(localStorage.getItem('banner_image5'));

            this.banner_category_id_1 = JSON.parse(localStorage.getItem('banner_category_id_1'));
            this.banner_category_id_2 = JSON.parse(localStorage.getItem('banner_category_id_2'));
            this.banner_category_id_3 = JSON.parse(localStorage.getItem('banner_category_id_3'));
            this.banner_category_id_4 = JSON.parse(localStorage.getItem('banner_category_id_4'));
            this.banner_category_id_5 = JSON.parse(localStorage.getItem('banner_category_id_5'));
            this.banner_sub_category_id_1 = JSON.parse(localStorage.getItem('banner_sub_category_id_1'));
            this.banner_sub_category_id_2 = JSON.parse(localStorage.getItem('banner_sub_category_id_2'));
            this.banner_sub_category_id_3 = JSON.parse(localStorage.getItem('banner_sub_category_id_3'));
            this.banner_sub_category_id_4 = JSON.parse(localStorage.getItem('banner_sub_category_id_4'));
            this.banner_sub_category_id_5 = JSON.parse(localStorage.getItem('banner_sub_category_id_5'));
            this.banner_sub_sub_category_id_1 = JSON.parse(localStorage.getItem('banner_sub_sub_category_id_1'));
            this.banner_sub_sub_category_id_2 = JSON.parse(localStorage.getItem('banner_sub_sub_category_id_2'));
            this.banner_sub_sub_category_id_3 = JSON.parse(localStorage.getItem('banner_sub_sub_category_id_3'));
            this.banner_sub_sub_category_id_4 = JSON.parse(localStorage.getItem('banner_sub_sub_category_id_4'));
            this.banner_sub_sub_category_id_5 = JSON.parse(localStorage.getItem('banner_sub_sub_category_id_5'));

            this.best_selling_product_data_array = JSON.parse(localStorage.getItem('best_selling_product_data_array'));
            this.featured_product_data_array = JSON.parse(localStorage.getItem('featured_product_data_array'));
            this.new_arrival_product_data_array = JSON.parse(localStorage.getItem('new_arrival_product_data_array'));
            this.cssClass1 = "animated zoomIn";
            this.cssClass2 = "animated zoomIn";
            this.item_count = 1;
            var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
            /*this.loadingModal = this.loadingCtrl.create(
            {
                spinner:'hide',
                content: '<img src="assets/icon/loader.gif">',
                //dismissOnPageChange: true,
                enableBackdropDismiss: true
            });
            this.loadingModal.present();*/
            this.moduleService.view_home_data(mobile_access_token).then((db_result: any) => 
            {
                this.db_result = db_result;
                if(db_result.status_code == 200)
                {
                    this.item_count = 1;
                    this.events.publish('cart:updated', db_result.cart_items_count);
                    if(mobile_access_token == '')
                    {
                        if(JSON.parse(localStorage.getItem('cart_items_count')) == '' || JSON.parse(localStorage.getItem('cart_items_count')) == null)
                        {
                            localStorage.setItem('cart_items_count', JSON.stringify(0));
                            this.cart_items_count = 0;
                        }
                        else
                        {
                            this.cart_items_count = JSON.parse(localStorage.getItem('cart_items_count'));
                        }
                    }
                    else
                    {
                        if(db_result.cart_items_count == '' || db_result.cart_items_count == null)
                        {
                            localStorage.setItem('cart_items_count', JSON.stringify(0));
                            this.cart_items_count = 0;
                        }
                        else
                        {
                            localStorage.setItem('cart_items_count', JSON.stringify(db_result.cart_items_count));
                            this.cart_items_count = db_result.cart_items_count;
                        }
                    }
                }
                //this.loadingModal.dismiss();
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
                //this.loadingModal.dismiss();
            });
        }
        else
        {
            var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
            /*this.loadingModal = this.loadingCtrl.create(
            {
                spinner:'hide',
                content: '<img src="assets/icon/loader.gif">',
                //dismissOnPageChange: true,
                enableBackdropDismiss: true
            });
            this.loadingModal.present();*/
            this.moduleService.view_home_data(mobile_access_token).then((db_result: any) => 
            {
                this.db_result = db_result;
                if(db_result.status_code == 200)
                { 
                    this.events.publish('cart:updated', db_result.cart_items_count);
                    this.bg_image1_color = db_result.bg_image1_color;
                    this.bg_image2_color = db_result.bg_image2_color;
                    this.bg_image1 = db_result.bg_image1;
                    this.bg_image2 = db_result.bg_image2;
                    this.bg_image3 = db_result.bg_image3;
                    this.slider_data_array = db_result.slider_data;
                    this.banner_image1 = db_result.banner_image1;
                    this.banner_image2 = db_result.banner_image2;
                    this.banner_image3 = db_result.banner_image3;
                    this.banner_image4 = db_result.banner_image4;
                    this.banner_image5 = db_result.banner_image5;

                    this.banner_category_id_1 = db_result.banner_category_id_1;
                    this.banner_category_id_2 = db_result.banner_category_id_2;
                    this.banner_category_id_3 = db_result.banner_category_id_3;
                    this.banner_category_id_4 = db_result.banner_category_id_4;
                    this.banner_category_id_5 = db_result.banner_category_id_5;
                    this.banner_sub_category_id_1 = db_result.banner_sub_category_id_1;
                    this.banner_sub_category_id_2 = db_result.banner_sub_category_id_2;
                    this.banner_sub_category_id_3 = db_result.banner_sub_category_id_3;
                    this.banner_sub_category_id_4 = db_result.banner_sub_category_id_4;
                    this.banner_sub_category_id_5 = db_result.banner_sub_category_id_5;
                    this.banner_sub_sub_category_id_1 = db_result.banner_sub_sub_category_id_1;
                    this.banner_sub_sub_category_id_2 = db_result.banner_sub_sub_category_id_2;
                    this.banner_sub_sub_category_id_3 = db_result.banner_sub_sub_category_id_3;
                    this.banner_sub_sub_category_id_4 = db_result.banner_sub_sub_category_id_4;
                    this.banner_sub_sub_category_id_5 = db_result.banner_sub_sub_category_id_5;
                    this.best_selling_product_data_array = db_result.best_selling_product_data;
                    this.featured_product_data_array = db_result.featured_product_data;
                    this.new_arrival_product_data_array = db_result.new_arrival_product_data;

                    if(mobile_access_token == '')
                    {
                        if(JSON.parse(localStorage.getItem('cart_items_count')) == '' || JSON.parse(localStorage.getItem('cart_items_count')) == null)
                        {
                            localStorage.setItem('cart_items_count', JSON.stringify(0));
                            this.cart_items_count = 0;
                        }
                        else
                        {
                            this.cart_items_count = JSON.parse(localStorage.getItem('cart_items_count'));
                        }
                    }
                    else
                    {
                        if(db_result.cart_items_count == '' || db_result.cart_items_count == null)
                        {
                            localStorage.setItem('cart_items_count', JSON.stringify(0));
                            this.cart_items_count = 0;
                        }
                        else
                        {
                            localStorage.setItem('cart_items_count', JSON.stringify(db_result.cart_items_count));
                            this.cart_items_count = db_result.cart_items_count;
                        }
                    }

                    this.cssClass1 = "animated zoomIn";
                    this.cssClass2 = "animated zoomIn";

                    localStorage.setItem('home_data', JSON.stringify(1));

                    localStorage.setItem('bg_image1_color', JSON.stringify(db_result.bg_image1_color));
                    localStorage.setItem('bg_image2_color', JSON.stringify(db_result.bg_image2_color));
                    localStorage.setItem('bg_image1', JSON.stringify(db_result.bg_image1));
                    localStorage.setItem('bg_image2', JSON.stringify(db_result.bg_image2));
                    localStorage.setItem('bg_image3', JSON.stringify(db_result.bg_image3));
                    localStorage.setItem('slider_data_array', JSON.stringify(db_result.slider_data));
                    localStorage.setItem('banner_image1', JSON.stringify(db_result.banner_image1));
                    localStorage.setItem('banner_image2', JSON.stringify(db_result.banner_image2));
                    localStorage.setItem('banner_image3', JSON.stringify(db_result.banner_image3));
                    localStorage.setItem('banner_image4', JSON.stringify(db_result.banner_image4));
                    localStorage.setItem('banner_image5', JSON.stringify(db_result.banner_image5));

                    localStorage.setItem('banner_category_id_1', JSON.stringify(db_result.banner_category_id_1));
                    localStorage.setItem('banner_category_id_2', JSON.stringify(db_result.banner_category_id_2));
                    localStorage.setItem('banner_category_id_3', JSON.stringify(db_result.banner_category_id_3));
                    localStorage.setItem('banner_category_id_4', JSON.stringify(db_result.banner_category_id_4));
                    localStorage.setItem('banner_category_id_5', JSON.stringify(db_result.banner_category_id_5));
                    localStorage.setItem('banner_sub_category_id_1', JSON.stringify(db_result.banner_sub_category_id_1));
                    localStorage.setItem('banner_sub_category_id_2', JSON.stringify(db_result.banner_sub_category_id_2));
                    localStorage.setItem('banner_sub_category_id_3', JSON.stringify(db_result.banner_sub_category_id_3));
                    localStorage.setItem('banner_sub_category_id_4', JSON.stringify(db_result.banner_sub_category_id_4));
                    localStorage.setItem('banner_sub_category_id_5', JSON.stringify(db_result.banner_sub_category_id_5));
                    localStorage.setItem('banner_sub_sub_category_id_1', JSON.stringify(db_result.banner_sub_sub_category_id_1));
                    localStorage.setItem('banner_sub_sub_category_id_2', JSON.stringify(db_result.banner_sub_sub_category_id_2));
                    localStorage.setItem('banner_sub_sub_category_id_3', JSON.stringify(db_result.banner_sub_sub_category_id_3));
                    localStorage.setItem('banner_sub_sub_category_id_4', JSON.stringify(db_result.banner_sub_sub_category_id_4));
                    localStorage.setItem('banner_sub_sub_category_id_5', JSON.stringify(db_result.banner_sub_sub_category_id_5));

                    localStorage.setItem('best_selling_product_data_array', JSON.stringify(db_result.best_selling_product_data));
                    localStorage.setItem('featured_product_data_array', JSON.stringify(db_result.featured_product_data));
                    localStorage.setItem('new_arrival_product_data_array', JSON.stringify(db_result.new_arrival_product_data));
                    this.item_count = 1;
                }
                else
                {
                    this.slider_data_array = '';
                    this.banner_data_array = '';
                    this.best_selling_product_data_array = '';
                    this.featured_product_data_array = '';
                    this.new_arrival_product_data_array = '';
                    this.item_count = 0;
                    let toast = this.toastCtrl.create
                    ({
                        message: db_result.message,
                        duration: 1500,
                        position: 'bottom',
                    });
                    toast.present();
                }
                //this.loadingModal.dismiss();
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
                //this.loadingModal.dismiss();
            });
        }
        this.category_data_array = '';
        this.viewCategories();
        console.log('ionViewDidLoad HomePage');
    }

    viewCategories()
    {
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
                this.category_count = 1;
                this.category_data_array = db_result.data;

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
                this.category_count = 0;
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

    openProductDetails(product_variant_seo_url)
    {
        localStorage.setItem('product_variant_seo_url', JSON.stringify(product_variant_seo_url));
        this.navCtrl.push('ViewProductDetailsPage',{ product_variant_seo_url:product_variant_seo_url });
    }

    openNotification()
    {
        this.navCtrl.push('NotificationPage');
    }

    openSpeechRecognition()
    {
        this.navCtrl.push('SpeechRecognitionPage');
    }

    viewProfile()
    {
        this.navCtrl.push('ViewProfilePage');
    }

    editProfile()
    {
        this.navCtrl.push('EditProfilePage');
    }

    addAddress()
    {
        this.navCtrl.push('AddAddressPage');
    }

    viewAddress()
    {
        this.navCtrl.push('ViewAddressPage');
    }

    editAddress()
    {
        this.navCtrl.push('EditAddressPage');
    }

    viewOrders()
    {
        this.navCtrl.push('ViewOrdersPage');
    }

    viewWishlists()
    {
        this.navCtrl.push('ViewMyWishlistsPage');
    }

    viewCart()
    {
        this.navCtrl.push('ViewMyCartPage');
    }

    viewReview()
    {
        this.navCtrl.push('ViewReviewPage');
    }

    viewCheckout()
    {
        this.navCtrl.push('ViewCheckoutPage');
    }

    viewRange()
    {
        this.structure = { lower: this.min_value, upper: this.max_value };
    }

    openCategories(category_id,sub_category_id,sub_sub_category_id)
    {
        if(category_id != '')
        {
            this.navCtrl.push('ViewCataloguePage',{ category_title:'',cat_id:category_id,sub_cat_id:sub_category_id,sub_sub_cat_id:sub_sub_category_id });
        }
    }

    reloadPage()
    {
        var mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
        /*this.loadingModal = this.loadingCtrl.create(
        {
            spinner:'hide',
            content: '<img src="assets/icon/loader.gif">',
            //dismissOnPageChange: true,
            enableBackdropDismiss: true
        });
        this.loadingModal.present();*/
        this.moduleService.view_home_data(mobile_access_token).then((db_result: any) => 
        {
            this.db_result = db_result;
            if(db_result.status_code == 200)
            { 
                this.events.publish('cart:updated', db_result.cart_items_count);
                this.bg_image1_color = db_result.bg_image1_color;
                this.bg_image2_color = db_result.bg_image2_color;
                this.bg_image1 = db_result.bg_image1;
                this.bg_image2 = db_result.bg_image2;
                this.bg_image3 = db_result.bg_image3;
                this.slider_data_array = db_result.slider_data;
                this.banner_image1 = db_result.banner_image1;
                this.banner_image2 = db_result.banner_image2;
                this.banner_image3 = db_result.banner_image3;
                this.banner_image4 = db_result.banner_image4;
                this.banner_image5 = db_result.banner_image5;

                this.banner_category_id_1 = db_result.banner_category_id_1;
                this.banner_category_id_2 = db_result.banner_category_id_2;
                this.banner_category_id_3 = db_result.banner_category_id_3;
                this.banner_category_id_4 = db_result.banner_category_id_4;
                this.banner_category_id_5 = db_result.banner_category_id_5;
                this.banner_sub_category_id_1 = db_result.banner_sub_category_id_1;
                this.banner_sub_category_id_2 = db_result.banner_sub_category_id_2;
                this.banner_sub_category_id_3 = db_result.banner_sub_category_id_3;
                this.banner_sub_category_id_4 = db_result.banner_sub_category_id_4;
                this.banner_sub_category_id_5 = db_result.banner_sub_category_id_5;
                this.banner_sub_sub_category_id_1 = db_result.banner_sub_sub_category_id_1;
                this.banner_sub_sub_category_id_2 = db_result.banner_sub_sub_category_id_2;
                this.banner_sub_sub_category_id_3 = db_result.banner_sub_sub_category_id_3;
                this.banner_sub_sub_category_id_4 = db_result.banner_sub_sub_category_id_4;
                this.banner_sub_sub_category_id_5 = db_result.banner_sub_sub_category_id_5;
                this.best_selling_product_data_array = db_result.best_selling_product_data;
                this.featured_product_data_array = db_result.featured_product_data;
                this.new_arrival_product_data_array = db_result.new_arrival_product_data;

                if(mobile_access_token == '')
                {
                    if(JSON.parse(localStorage.getItem('cart_items_count')) == '' || JSON.parse(localStorage.getItem('cart_items_count')) == null)
                    {
                        localStorage.setItem('cart_items_count', JSON.stringify(0));
                        this.cart_items_count = 0;
                    }
                    else
                    {
                        this.cart_items_count = JSON.parse(localStorage.getItem('cart_items_count'));
                    }
                }
                else
                {
                    if(db_result.cart_items_count == '' || db_result.cart_items_count == null)
                    {
                        localStorage.setItem('cart_items_count', JSON.stringify(0));
                        this.cart_items_count = 0;
                    }
                    else
                    {
                        localStorage.setItem('cart_items_count', JSON.stringify(db_result.cart_items_count));
                        this.cart_items_count = db_result.cart_items_count;
                    }
                }

                this.cssClass1 = "animated zoomIn";
                this.cssClass2 = "animated zoomIn";

                localStorage.setItem('home_data', JSON.stringify(1));

                localStorage.setItem('bg_image1_color', JSON.stringify(db_result.bg_image1_color));
                localStorage.setItem('bg_image2_color', JSON.stringify(db_result.bg_image2_color));
                localStorage.setItem('bg_image1', JSON.stringify(db_result.bg_image1));
                localStorage.setItem('bg_image2', JSON.stringify(db_result.bg_image2));
                localStorage.setItem('bg_image3', JSON.stringify(db_result.bg_image3));
                localStorage.setItem('slider_data_array', JSON.stringify(db_result.slider_data));
                localStorage.setItem('banner_image1', JSON.stringify(db_result.banner_image1));
                localStorage.setItem('banner_image2', JSON.stringify(db_result.banner_image2));
                localStorage.setItem('banner_image3', JSON.stringify(db_result.banner_image3));
                localStorage.setItem('banner_image4', JSON.stringify(db_result.banner_image4));
                localStorage.setItem('banner_image5', JSON.stringify(db_result.banner_image5));

                localStorage.setItem('banner_category_id_1', JSON.stringify(db_result.banner_category_id_1));
                localStorage.setItem('banner_category_id_2', JSON.stringify(db_result.banner_category_id_2));
                localStorage.setItem('banner_category_id_3', JSON.stringify(db_result.banner_category_id_3));
                localStorage.setItem('banner_category_id_4', JSON.stringify(db_result.banner_category_id_4));
                localStorage.setItem('banner_category_id_5', JSON.stringify(db_result.banner_category_id_5));
                localStorage.setItem('banner_sub_category_id_1', JSON.stringify(db_result.banner_sub_category_id_1));
                localStorage.setItem('banner_sub_category_id_2', JSON.stringify(db_result.banner_sub_category_id_2));
                localStorage.setItem('banner_sub_category_id_3', JSON.stringify(db_result.banner_sub_category_id_3));
                localStorage.setItem('banner_sub_category_id_4', JSON.stringify(db_result.banner_sub_category_id_4));
                localStorage.setItem('banner_sub_category_id_5', JSON.stringify(db_result.banner_sub_category_id_5));
                localStorage.setItem('banner_sub_sub_category_id_1', JSON.stringify(db_result.banner_sub_sub_category_id_1));
                localStorage.setItem('banner_sub_sub_category_id_2', JSON.stringify(db_result.banner_sub_sub_category_id_2));
                localStorage.setItem('banner_sub_sub_category_id_3', JSON.stringify(db_result.banner_sub_sub_category_id_3));
                localStorage.setItem('banner_sub_sub_category_id_4', JSON.stringify(db_result.banner_sub_sub_category_id_4));
                localStorage.setItem('banner_sub_sub_category_id_5', JSON.stringify(db_result.banner_sub_sub_category_id_5));

                localStorage.setItem('best_selling_product_data_array', JSON.stringify(db_result.best_selling_product_data));
                localStorage.setItem('featured_product_data_array', JSON.stringify(db_result.featured_product_data));
                localStorage.setItem('new_arrival_product_data_array', JSON.stringify(db_result.new_arrival_product_data));
                this.item_count = 1;
            }
            else
            {
                this.slider_data_array = '';
                this.banner_data_array = '';
                this.best_selling_product_data_array = '';
                this.featured_product_data_array = '';
                this.new_arrival_product_data_array = '';
                this.item_count = 0;
                let toast = this.toastCtrl.create
                ({
                    message: db_result.message,
                    duration: 1500,
                    position: 'bottom',
                });
                toast.present();
            }
            //this.loadingModal.dismiss();
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
            //this.loadingModal.dismiss();
        });
        this.category_data_array = '';
        this.viewCategories();
    }

    onFocus($event)
    {
        this.navCtrl.push('ViewSearchCataloguePage',{ product_search:'' });
    }

    onBlur($event)
    {
        setTimeout(() => 
        {
            
        }, 1000); 
    }
}

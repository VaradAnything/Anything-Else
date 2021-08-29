import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController,ToastController, MenuController,AlertController } from 'ionic-angular';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http }  from '@angular/http';
import { ModuleProvider } from '../../providers/module-service';
import { Events } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
//import { Facebook } from '@ionic-native/facebook';
//import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component
({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})

export class SigninPage 
{   
    shouldHeight = document.body.clientHeight + 'px' ;
    loadingModal: any;
    db_result: any;
    
    moduleForm: FormGroup;
    submitAttempt: boolean = false;

    moduleForm1: FormGroup;
    submitAttempt1: boolean = false;

    login_type: number = 0;
    is_signup: number = 0;

    without_login_cart_data_array: Array<{product_id: string,category_id: string,product_variant_id: string,product_image: string,product_name: string,product_seo_url: string,product_variant_seo_url: string,product_variant_mrp: string,product_variant_price : string,product_variant_quantity : string,product_variant_one: string,product_variant_two:string}>;

    view_cart: number = 0;

    gender:string = 'male';

    constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public events: Events,public datepipe: DatePipe,private menu: MenuController, private nativePageTransitions: NativePageTransitions, public nativeStorage: NativeStorage, public alertCtrl: AlertController)
    //constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public events: Events,public datepipe: DatePipe,private menu: MenuController, private nativePageTransitions: NativePageTransitions,public fb: Facebook, public nativeStorage: NativeStorage,public alertCtrl: AlertController) 
    {
        this.navCtrl= navCtrl;
        this.http = http;
        this.moduleForm = formBuilder.group
        ({
           email: ['', Validators.compose([Validators.maxLength(30),  Validators.required, Validators.email])],
           password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30),  Validators.required])],
        });

        this.moduleForm1 = formBuilder.group
        ({
            first_name: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(30),  Validators.required])],
            last_name: ['', Validators.compose([Validators.minLength(1),Validators.maxLength(30),  Validators.required])],
            email: ['', Validators.compose([Validators.maxLength(100),  Validators.required, Validators.email])],
            mobile: ['', Validators.compose([Validators.minLength(10),Validators.maxLength(10),  Validators.required])],
            password: ['', Validators.compose([Validators.minLength(6),Validators.maxLength(30),  Validators.required])],
            confirm_password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30),  Validators.required])],
        });
        //this.fb.browserInit(this.FB_APP_ID, "v3.0");
    }

    ionViewDidLoad() 
    {
        this.menu.swipeEnable(false);
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
        localStorage.setItem('page_name', JSON.stringify('SigninPage'));

        localStorage.setItem('home_data', JSON.stringify(0));
        localStorage.setItem('main_categories_data', JSON.stringify(0));

        this.menu.swipeEnable(false);
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
        this.menu.swipeEnable(true);
        let elements = document.querySelectorAll(".tabbar");

        if (elements != null) 
        {
            Object.keys(elements).map((key) => 
            {
                elements[key].style.display = 'flex';
            });
        }
    }

    loginChoice(type) 
    {
        this.submitAttempt = false;
        this.submitAttempt1 = false;
        this.is_signup = type;
        //this.navCtrl.setRoot('SignupPage');
    }

    eventHandler(keyCode,data)
    {
        if(keyCode == 13)
        {
           //this.temp_signin();
           this.signin();
        }
    }

    temp_signin() 
    {
        this.submitAttempt = true;
        if(!this.moduleForm.valid)
        { 
          
        } 
        else 
        { 
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
                'email': this.moduleForm.value.email, 'password': this.moduleForm.value.password,'registered_from': '', 'player_id': localStorage.getItem('player_id_list')
            };
            this.moduleService.signin('', { form_data }).then((data: any) => 
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
                        if(data.mobile_verified == 1)
                        {
                            this.events.publish('side_menu_user_name:updated', data.data.user_name);
                            this.events.publish('side_menu_login_type:updated', '1');
                            this.events.publish('cart:updated', data.cart_items_count);
                            localStorage.setItem('user_name', JSON.stringify(data.data.user_name));
                            localStorage.setItem('email', JSON.stringify(data.data.email));
                            localStorage.setItem('mobile', JSON.stringify(data.data.mobile));
                            localStorage.setItem('mobile_access_token', JSON.stringify(data.data.mobile_access_token));
                            localStorage.setItem('login_type', JSON.stringify(1));
                            this.navCtrl.setRoot('HomePage');
                        }
                        else
                        { 
                            this.navCtrl.push('MobileOtpPage',{ email:data.data.email,mobile:data.data.mobile,module_type:'2' });
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

    signin() 
    {
        this.submitAttempt = true;

        if(!this.moduleForm.valid)
        { 
            
        } 
        else 
        {
            this.loadingModal = this.loadingCtrl.create
            ({ 
                spinner:'hide',
                content: '<img src="assets/icon/loader.gif">',
                //dismissOnPageChange: true,
                enableBackdropDismiss: true
            });
            this.loadingModal.present();

            var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

            localStorage.setItem('home_data', JSON.stringify(0));
            localStorage.setItem('main_categories_data', JSON.stringify(0));
          
            let form_data = 
            {
                'email': this.moduleForm.value.email, 'password': this.moduleForm.value.password,'registered_from': '','session_cart_data': without_login_cart_data_array, 'player_id': localStorage.getItem('player_id_list')
            };
            this.moduleService.signin('', { form_data }).then((data: any) => 
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
                        if(data.mobile_verified == 1)
                        {
                            this.events.publish('side_menu_user_name:updated', data.data.user_name);
                            this.events.publish('side_menu_login_type:updated', '1');

                            this.events.publish('cart:updated', data.cart_items_count);
                            localStorage.setItem('user_name', JSON.stringify(data.data.user_name));
                            localStorage.setItem('email', JSON.stringify(data.data.email));
                            localStorage.setItem('mobile', JSON.stringify(data.data.mobile));
                            localStorage.setItem('mobile_access_token', JSON.stringify(data.data.mobile_access_token));

                            if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) == '' || JSON.parse(localStorage.getItem('without_login_cart_data_array')) == null)
                            {
                                this.view_cart = 0;
                            }
                            else
                            {
                                this.view_cart = 1;
                            }

                            localStorage.setItem('login_type', JSON.stringify(1));
                            var without_login_cart_data_array = [];
                            localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));

                            /*var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));
                            if(without_login_cart_data_array != null)
                            {
                                this.addWithoutLoginCartData(without_login_cart_data_array); 
                            }*/

                            if(this.view_cart == 0)
                            {
                                this.navCtrl.setRoot('HomePage');
                            }
                            else
                            {
                                this.navCtrl.setRoot('ViewMyCartPage');
                            }
                        }
                        else
                        {
                            this.navCtrl.push('MobileOtpPage',{ email:data.data.email,mobile:data.data.mobile,module_type:'2' });
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

    fbSignin()
    {
        /*let permissions = new Array<string>();

        permissions = ["public_profile"];

        this.fb.login(permissions).then((response) =>
        {
            let userId = response.authResponse.userID;
            let params = new Array<string>();

            this.fb.api("/me?fields=first_name,last_name,gender,email,id", params).then((user) =>
            {
                user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
                this.nativeStorage.setItem('user',
                {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    gender: user.gender,
                    picture: user.picture
                })
                .then(() =>
                {
                    this.loadingModal = this.loadingCtrl.create
                    ({
                        spinner:'hide',
                        content: '<img src="assets/icon/loader.gif">'
                    });
                    this.loadingModal.present();

                    var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

                    localStorage.setItem('home_data', JSON.stringify(0));
                    localStorage.setItem('main_categories_data', JSON.stringify(0));
                    
                    let form_data = 
                    {
                        'first_name': user.first_name,'last_name': user.last_name,'email': user.email,'gender': user.gender,'mobile': '', 'password': '','confirm_password': '','id': userId ,'registered_from': 'facebook','session_cart_data': without_login_cart_data_array, 'player_id': localStorage.getItem('player_id_list')
                    };

                    this.moduleService.signin('', { form_data }).then((data: any) => 
                    {
                        if(data) 
                        {
                            if(data.status_code == 200)
                            {
                                let toast = this.toastCtrl.create
                                ({
                                    message: data.msg,
                                    duration: 1500,
                                    position: 'bottom',
                                });
                                toast.present();

                                if(data.mobile_verified == 1)
                                {
                                    this.events.publish('side_menu_user_name:updated', data.data.user_name);
                                    this.events.publish('side_menu_login_type:updated', '1');

                                    this.events.publish('cart:updated', data.cart_items_count);
                                    localStorage.setItem('user_name', JSON.stringify(data.data.user_name));
                                    localStorage.setItem('email', JSON.stringify(data.data.email));
                                    localStorage.setItem('mobile', JSON.stringify(data.data.mobile));
                                    localStorage.setItem('mobile_access_token', JSON.stringify(data.data.mobile_access_token));

                                    if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) == '' || JSON.parse(localStorage.getItem('without_login_cart_data_array')) == null)
                                    {
                                        this.view_cart = 0;
                                    }
                                    else
                                    {
                                        this.view_cart = 1;
                                    }

                                    localStorage.setItem('login_type', JSON.stringify(1));
                                    var without_login_cart_data_array = [];
                                    localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));

                                    if(this.view_cart == 0)
                                    {
                                        this.navCtrl.setRoot('HomePage');
                                    }
                                    else
                                    {
                                        this.navCtrl.setRoot('ViewMyCartPage');
                                    }
                                }
                                else
                                {   
                                    this.navCtrl.push('MobileOtpPage',{ email:data.data.email,mobile:data.data.mobile,module_type:'2' });
                                }   
                            }
                            else
                            {
                                let toast = this.toastCtrl.create
                                ({
                                    message: data.msg,
                                    duration: 1500,
                                    position: 'bottom'
                                });
                                toast.present();
                            }  
                            this.loadingModal.dismiss();   
                        }
                    }, 
                    (reson) => 
                    {
                        let toast = this.toastCtrl.create
                        ({
                            message: 'No Internet Connection',
                            duration: 1500,
                            position: 'bottom',
                        });
                        toast.present();
                        this.loadingModal.dismiss();
                    });
                },
                (error) =>
                {
                })
            })
        },
        (error) =>
        {
        });*/
    }

    googleSignin()
    {
        /*let loading = this.loadingCtrl.create
        ({
            content: 'Please wait...'
        });
        loading.present();*/
        /*this.loadingModal = this.loadingCtrl.create
        ({  
            spinner:'hide',
            content: '<img src="assets/icon/loader.gif">'
        });
        this.loadingModal.present();*/
        /*this.googlePlus.login
        ({
            'scopes': '',
            'webClientId': '78015579138-4042g5duplcdasp45gg2oq52eg1jkth7.apps.googleusercontent.com',
            'offline': true
        })
        .then((user) => 
        {
            //this.loadingModal.dismiss();

            this.nativeStorage.setItem('user', 
            {
                name: user.displayName,
                email: user.email,
                picture: user.imageUrl
            })
            .then(() => 
            {
                this.loadingModal = this.loadingCtrl.create
                ({
                    spinner:'hide',
                    content: '<img src="assets/icon/loader.gif">'
                });
                this.loadingModal.present();

                var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

                localStorage.setItem('home_data', JSON.stringify(0));
                localStorage.setItem('main_categories_data', JSON.stringify(0));

                var display_name = user.displayName;
                let user_name = display_name.split(" ");
                
                let form_data = 
                {
                    'first_name': user_name[0],'last_name': user_name[1],'email': user.email,'gender': user.gender,'mobile': '', 'password': '','confirm_password': '','id': user.id ,'registered_from': 'google_plus','session_cart_data': without_login_cart_data_array, 'player_id': localStorage.getItem('player_id_list')
                };

                this.moduleService.signin('', { form_data }).then((data: any) => 
                {
                    if(data) 
                    {
                        if(data.status_code == 200)
                        {
                            let toast = this.toastCtrl.create
                            ({
                                message: data.msg,
                                duration: 1500,
                                position: 'bottom',
                            });
                            toast.present();

                            if(data.mobile_verified == 1)
                            {
                                this.events.publish('side_menu_user_name:updated', data.data.user_name);
                                this.events.publish('side_menu_login_type:updated', '1');

                                this.events.publish('cart:updated', data.cart_items_count);
                                localStorage.setItem('user_name', JSON.stringify(data.data.user_name));
                                localStorage.setItem('email', JSON.stringify(data.data.email));
                                localStorage.setItem('mobile', JSON.stringify(data.data.mobile));
                                localStorage.setItem('mobile_access_token', JSON.stringify(data.data.mobile_access_token));

                                if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) == '' || JSON.parse(localStorage.getItem('without_login_cart_data_array')) == null)
                                {
                                    this.view_cart = 0;
                                }
                                else
                                {
                                    this.view_cart = 1;
                                }

                                localStorage.setItem('login_type', JSON.stringify(1));
                                var without_login_cart_data_array = [];
                                localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));

                                if(this.view_cart == 0)
                                {
                                    this.navCtrl.setRoot('HomePage');
                                }
                                else
                                {
                                    this.navCtrl.setRoot('ViewMyCartPage');
                                }
                            }
                            else
                            {   
                                this.navCtrl.push('MobileOtpPage',{ email:data.data.email,mobile:data.data.mobile,module_type:'2' });
                            }   
                        }
                        else
                        {
                            let toast = this.toastCtrl.create
                            ({
                                message: data.msg,
                                duration: 1500,
                                position: 'bottom'
                            });
                            toast.present();
                        }  
                        this.loadingModal.dismiss();   
                    }
                }, 
                (reson) => 
                {
                    //let alert = this.alertCtrl.create
                    //({
                        //title: 'No Internet Connection',
                        //subTitle: 'Please check your internet connection and try again',
                        //buttons: ['OK']
                    //});
                    //alert.present();
                    let toast = this.toastCtrl.create
                    ({
                        message: 'No Internet Connection',
                        duration: 1500,
                        position: 'bottom',
                    });
                    toast.present();
                    this.loadingModal.dismiss();
                });
            }, (error) => 
            {
                console.log(error);
            })
        }, (error) => 
        {
            //this.loadingModal.dismiss();
        });*/
    }

    getGender(type)
    {
        this.gender = type;
    }

    eventHandler1(keyCode,data)
    {
        if(keyCode == 13)
        {
          this.signup();
        }
    }

    signup() 
    {
        this.submitAttempt1 = true;

        if(!this.moduleForm1.valid)
        { 
            
        } 
        else 
        {
            if(this.moduleForm1.value.password == this.moduleForm1.value.confirm_password)
            {
                this.loadingModal = this.loadingCtrl.create
                ({ 
                    spinner:'hide',
                    content: '<img src="assets/icon/loader.gif">',
                    //dismissOnPageChange: true,
                enableBackdropDismiss: true
                });
                this.loadingModal.present();

                var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

                localStorage.setItem('home_data', JSON.stringify(0));
                localStorage.setItem('main_categories_data', JSON.stringify(0));
                
                let form_data = 
                {
                    'first_name': this.moduleForm1.value.first_name,'last_name': this.moduleForm1.value.last_name,'email': this.moduleForm1.value.email,'gender': this.gender,'mobile': this.moduleForm1.value.mobile, 'password': this.moduleForm1.value.password,'confirm_password': this.moduleForm1.value.confirm_password,'registered_from': '','session_cart_data': without_login_cart_data_array, 'player_id': localStorage.getItem('player_id_list')
                };
                this.moduleService.signup('', { form_data }).then((data: any) => 
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

                            var user_name = this.moduleForm1.value.first_name + '' + this.moduleForm1.value.last_name;

                            if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) == '')
                            {
                                this.view_cart = 0;
                            }
                            else if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) != '')
                            {
                                this.view_cart = 1;
                            }
                            else
                            {
                                this.view_cart = 0;
                            }

                            var without_login_cart_data_array = [];
                            localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
                            this.events.publish('side_menu_user_name:updated', user_name);
                            this.events.publish('side_menu_login_type:updated', '1');
                            localStorage.setItem('login_type', JSON.stringify(0));

                            this.navCtrl.push('MobileOtpPage',{ email:this.moduleForm1.value.email,mobile:this.moduleForm1.value.mobile,module_type:'1' });
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
                let toast = this.toastCtrl.create
                ({
                    message: 'Confirm Password Should Be Matched With Password',
                    duration: 1500,
                    position: 'bottom',
                });
                toast.present();
            }
        }
    }

    fbSignup()
    {
        /*let permissions = new Array<string>();
        let nav = this.navCtrl;

        permissions = ["public_profile"];

        this.fb.login(permissions).then((response) =>
        {
            let userId = response.authResponse.userID;
            let params = new Array<string>();

            this.fb.api("/me?fields=first_name,last_name,gender,email,id", params).then((user) =>
            {
                user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
                this.nativeStorage.setItem('user',
                {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    gender: user.gender,
                    picture: user.picture
                })
                .then(() =>
                {
                    this.loadingModal = this.loadingCtrl.create
                    ({
                        spinner:'hide',
                        content: '<img src="assets/icon/loader.gif">'
                    });
                    this.loadingModal.present();

                    var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

                    localStorage.setItem('home_data', JSON.stringify(0));
                    localStorage.setItem('main_categories_data', JSON.stringify(0));
                    
                    let form_data = 
                    {
                        'first_name': user.first_name,'last_name': user.last_name,'email': user.email,'gender': user.gender,'mobile': '', 'password': '','confirm_password': '','id': userId ,'registered_from': 'facebook','session_cart_data': without_login_cart_data_array, 'player_id': localStorage.getItem('player_id_list')
                    };

                    this.moduleService.signup('', { form_data }).then((data: any) => 
                    {
                        if(data) 
                        {
                            if(data.status_code == 200)
                            {
                                let toast = this.toastCtrl.create
                                ({
                                    message: data.msg,
                                    duration: 1500,
                                    position: 'bottom',
                                });
                                toast.present();

                                var user_name = user.first_name + '' + user.last_name;

                                if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) == '')
                                {
                                    this.view_cart = 0;
                                }
                                else if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) != '')
                                {
                                    this.view_cart = 1;
                                }
                                else
                                {
                                    this.view_cart = 0;
                                }

                                var without_login_cart_data_array = [];
                                localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
                                this.events.publish('side_menu_user_name:updated', user_name);
                                this.events.publish('side_menu_login_type:updated', '1');
                                localStorage.setItem('login_type', JSON.stringify(0));

                                this.navCtrl.push('MobileOtpPage',{ email:user.email,mobile:'',module_type:'1' });
                            }
                            else
                            {
                                let toast = this.toastCtrl.create
                                ({
                                    message: data.msg,
                                    duration: 1500,
                                    position: 'bottom'
                                });
                                toast.present();
                            }  
                            this.loadingModal.dismiss();   
                        }
                    }, 
                    (reson) => 
                    {
                        let toast = this.toastCtrl.create
                        ({
                            message: 'No Internet Connection',
                            duration: 1500,
                            position: 'bottom',
                        });
                        toast.present();
                        this.loadingModal.dismiss();
                    });
                },
                (error) =>
                {
                })
            })
        },
        (error) =>
        {
        });*/
    }

    googleSignup()
    {
        /*let loading = this.loadingCtrl.create
        ({
            content: 'Please wait...'
        });
        loading.present();*/
        /*this.loadingModal = this.loadingCtrl.create
        ({  
            spinner:'hide',
            content: '<img src="assets/icon/loader.gif">'
        });
        this.loadingModal.present();*/
        /*this.googlePlus.login
        ({
            'scopes': '',
            'webClientId': '78015579138-4042g5duplcdasp45gg2oq52eg1jkth7.apps.googleusercontent.com',
            'offline': true
        })
        .then((user) => 
        {
            //this.loadingModal.dismiss();

            this.nativeStorage.setItem('user', 
            {
                name: user.displayName,
                email: user.email,
                picture: user.imageUrl
            })
            .then(() => 
            {
                this.loadingModal = this.loadingCtrl.create
                ({
                    spinner:'hide',
                    content: '<img src="assets/icon/loader.gif">'
                });
                this.loadingModal.present();

                var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));

                localStorage.setItem('home_data', JSON.stringify(0));
                localStorage.setItem('main_categories_data', JSON.stringify(0));

                var display_name = user.displayName;
                let user_name = display_name.split(" ");
                
                let form_data = 
                {
                    'first_name': user_name[0],'last_name': user_name[1],'email': user.email,'gender': user.gender,'mobile': '', 'password': '','confirm_password': '','id': user.id ,'registered_from': 'google_plus','session_cart_data': without_login_cart_data_array, 'player_id': localStorage.getItem('player_id_list')
                };

                this.moduleService.signup('', { form_data }).then((data: any) => 
                {
                    if(data) 
                    {
                        if(data.status_code == 200)
                        {
                            let toast = this.toastCtrl.create
                            ({
                                message: data.msg,
                                duration: 1500,
                                position: 'bottom',
                            });
                            toast.present();

                            var user_name = user.first_name + '' + user.last_name;

                            if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) == '')
                            {
                                this.view_cart = 0;
                            }
                            else if(JSON.parse(localStorage.getItem('without_login_cart_data_array')) != '')
                            {
                                this.view_cart = 1;
                            }
                            else
                            {
                                this.view_cart = 0;
                            }

                            var without_login_cart_data_array = [];
                            localStorage.setItem('without_login_cart_data_array', JSON.stringify(without_login_cart_data_array));
                            this.events.publish('side_menu_user_name:updated', user_name);
                            this.events.publish('side_menu_login_type:updated', '1');
                            localStorage.setItem('login_type', JSON.stringify(0));

                            this.navCtrl.push('MobileOtpPage',{ email:user.email,mobile:'',module_type:'1' });
                        }
                        else
                        {
                            let toast = this.toastCtrl.create
                            ({
                                message: data.msg,
                                duration: 1500,
                                position: 'bottom'
                            });
                            toast.present();
                        }  
                        this.loadingModal.dismiss();   
                    }
                }, 
                (reson) => 
                {
                    //let alert = this.alertCtrl.create
                    //({
                        //title: 'No Internet Connection',
                        //subTitle: 'Please check your internet connection and try again',
                        //buttons: ['OK']
                    //});
                    //alert.present();
                    let toast = this.toastCtrl.create
                    ({
                        message: 'No Internet Connection',
                        duration: 1500,
                        position: 'bottom',
                    });
                    toast.present();
                    this.loadingModal.dismiss();
                });
            }, (error) => 
            {
                console.log(error);
            })
        }, (error) => 
        {
            //this.loadingModal.dismiss();
        });*/
    }

    forgot()
    {
        this.navCtrl.push('ForgotPasswordPage');
    } 

    skip() 
    {
        this.events.publish('side_menu_user_name:updated', 'Guest User');
        this.events.publish('side_menu_login_type:updated', '0');

        this.events.publish('cart:updated', 0);
        localStorage.setItem('user_name', JSON.stringify('Guest User'));
        localStorage.setItem('email', JSON.stringify(''));
        localStorage.setItem('mobile', JSON.stringify(''));
        localStorage.setItem('mobile_access_token', JSON.stringify(''));
        localStorage.setItem('login_type', JSON.stringify(0));

        var without_login_cart_data_array = JSON.parse(localStorage.getItem('without_login_cart_data_array'));
    
        if(without_login_cart_data_array == '' || without_login_cart_data_array == null)
        {
            this.without_login_cart_data_array = [];
            localStorage.setItem('without_login_cart_data_array', JSON.stringify(this.without_login_cart_data_array));
        }

        this.navCtrl.setRoot('HomePage');
    }
}
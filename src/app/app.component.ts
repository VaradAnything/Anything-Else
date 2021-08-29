import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController,AlertController,ToastController, Nav, App } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Events } from 'ionic-angular';

//import { Market } from '@ionic-native/market';

import { Network } from '@ionic-native/network';

import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { OneSignal } from '@ionic-native/onesignal';

import { SocialSharing } from '@ionic-native/social-sharing';

@Component
({
  templateUrl: 'app.html'
})
export class MyApp 
{
    @ViewChild(Nav) nav: Nav;
    rootPage: string;

    user_name : string = '';
    login_type : number = 0;
    total_cart : number = 0;

    constructor(public platform: Platform,public menu: MenuController,public statusBar: StatusBar,public splashScreen: SplashScreen,public events: Events,public _app: App,public datepipe: DatePipe,public alertCtrl: AlertController, private toastCtrl:   ToastController,private network: Network,private _OneSignal: OneSignal,private socialSharing: SocialSharing) 
    {
        this.initializeApp();
        localStorage.setItem('home_data', JSON.stringify(0));
        localStorage.setItem('main_categories_data', JSON.stringify(0));
        this.events.subscribe('side_menu_user_name:updated', (user_details) => 
        {
            this.user_name = user_details;
        });
        this.events.subscribe('side_menu_login_type:updated', (login_type_count) => 
        {
            this.login_type = login_type_count;
        }); 

        if(this.user_name == '')
        {
            this.user_name = JSON.parse(localStorage.getItem('user_name'));
        }

        this.login_type = JSON.parse(localStorage.getItem('login_type'));
        if(JSON.parse(localStorage.getItem('login_type')) == 1)
        {
            this.rootPage = 'HomePage';
        }
        else
        {
            this.rootPage = 'SigninPage';
            /*if(JSON.parse(localStorage.getItem('is_seen_intro_slider')) == 1)
            {
                this.rootPage = 'SigninPage';
            }
            else
            {
                this.rootPage = 'ViewIntroSliderPage';
            }*/
        }
    }

    initializeApp() 
    {
        this.platform.ready().then(() => 
        {
            this.platform.registerBackButtonAction(() => 
            {
                const overlayView = this._app._appRoot._overlayPortal._views[0];
                if (overlayView && overlayView.dismiss) 
                {
                  overlayView.dismiss();
                  return;
                }
                if (this.nav.canGoBack()) 
                {
                  this.nav.pop();
                }
                else 
                {
                    let view = this.nav.getActive().id;
                    //alert(view);
                    if (view == 'AboutUsPage' || view == 'AddAddressPage' || view == 'ChangePasswordPage' || view == 'ContactUsPage' || view == 'EditAddressPage' || view == 'EditProfilePage' || view == 'FaqPage' || view == 'FilterPage' || view == 'ForgotPasswordPage' || view == 'MobileOtpPage' || view == 'NotificationPage' || view == 'ProfileMobileOtpPage' || view == 'ViewAddressPage' || view == 'ViewCataloguePage' || view == 'ViewCheckoutPage' || view == 'ViewCityPage' || view == 'ViewCountryPage' || view == 'ViewMyWishlistsPage' || view == 'ViewOrderDetailsPage' || view == 'ViewOrdersPage' || view == 'ViewProductDetailsPage' || view == 'ViewProfilePage' || view == 'ViewReturnsPage' || view == 'ViewStatePage' || view == 'ViewSubCategoriesPage') 
                    {
                        this.nav.pop();
                    }
                    else if (view == 'AccountPage')
                    {
                        this.nav.setRoot('ViewMyCartPage');
                    }
                    else if (view == 'ViewMyCartPage')
                    {
                        this.nav.setRoot('ViewMainCategoriesPage');
                    }
                    else if (view == 'ViewMainCategoriesPage' || view == 'ThankYouPage' || view == 'CancelPage' || view == 'ReturnPage')
                    {
                        this.nav.setRoot('HomePage');
                    }
                    else if (view == 'HomePage')
                    {
                        let confirm = this.alertCtrl.create
                        ({
                            message: 'Do you want to exit app?',  
                            buttons: 
                            [
                                {
                                    text: 'No',
                                    handler: () => 
                                    {
                                        //console.log('Disagree clicked');
                                    }
                                },
                                {
                                    text: 'Yes',
                                    handler: () => 
                                    {
                                    this.platform.exitApp();
                                    }
                                }
                            ]
                        });
                        confirm.present();
                    }
                    else if (view == 'SigninPage' || view == 'SignupPage' || view == 'ViewIntroSliderPage') 
                    {
                        let confirm = this.alertCtrl.create
                        ({
                            message: 'Do you want to exit app?',  
                            buttons: 
                            [
                                {
                                    text: 'No',
                                    handler: () => 
                                    {
                                        //console.log('Disagree clicked');
                                    }
                                },
                                {
                                    text: 'Yes',
                                    handler: () => 
                                    {
                                      this.platform.exitApp();
                                    }
                                }
                            ]
                        });
                        confirm.present();
                    }
                    else
                    {
                        let confirm = this.alertCtrl.create
                        ({
                            message: 'Do you want to exit app?',  
                            buttons: 
                            [
                                {
                                    text: 'No',
                                    handler: () => 
                                    {
                                        //console.log('Disagree clicked');
                                    }
                                },
                                {
                                    text: 'Yes',
                                    handler: () => 
                                    {
                                        this.platform.exitApp();
                                    }
                                }
                            ]
                        });
                        confirm.present();
                    }
                }
            });

            this.events.subscribe('cart:updated', (count) => 
            {
                this.total_cart = count;
            });

            let env = this;
            let disconnectSubscription = this.network.onDisconnect().subscribe(() => 
            {
                let alert = this.alertCtrl.create
                ({
                    title: 'No Internet Connection',
                    subTitle: 'Please check your internet connection and try again',
                    buttons: ['OK']
                });
                alert.present();
            });

           // stop disconnect watch
           //disconnectSubscription.unsubscribe();

           // watch network for a connection
           /*let connectSubscription = this.network.onConnect().subscribe(() => 
           {
                let alert = this.alertCtrl.create
                ({
                    title: 'No Internet Connection',
                    subTitle: 'Please check your internet connection and try again',
                    buttons: ['OK']
                });
                alert.present();
                console.log('network connected!');
           });*/

           // stop connect watch
           //connectSubscription.unsubscribe(); 

            //this._OneSignal.startInit('2e6851cb-11e1-43d9-8aa1-77186e707551', 'gocherish-5172f');
            //this._OneSignal.startInit('12fc964e-e0ad-4b65-a818-33583e79500d', 'anythingels-2315e');
            this._OneSignal.startInit('7e2ab375-9ff1-49c6-9e1f-629919db68c1', 'anythingelse-b51cf');
            this._OneSignal.inFocusDisplaying(this._OneSignal.OSInFocusDisplayOption.Notification);
            this._OneSignal.setSubscription(true);
            this._OneSignal.handleNotificationReceived().subscribe(() => {
              // handle received here how you wish.
            });
            this._OneSignal.handleNotificationOpened().subscribe(() => {
              if(JSON.parse(localStorage.getItem('login_type')) == 1)
              {
                this.nav.setRoot('HomePage');
              }
              else
              {
                this.nav.setRoot('SigninPage');
              }
            });
            this._OneSignal.endInit();

            this._OneSignal.getIds().then((id) => 
            {
                /*console.log(id);
                let alert = this.alertCtrl.create({
                title: 'the onesignal ids object',
                message: JSON.stringify(id),
                buttons: [{
                  text: 'Ok',
                  role: 'ok'
                }]
              });
              alert.present();*/
              localStorage.removeItem('player_id_list');
              localStorage.setItem('player_id_list', JSON.stringify(id));
            });
            
            //this.statusBar.styleDefault();
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString('#83b765');
            this.splashScreen.hide();
        });
    }

    goToSignin()
    {
        this.menu.close();
        localStorage.removeItem('user_name');
        localStorage.removeItem('email');
        localStorage.removeItem('mobile');
        localStorage.removeItem('mobile_access_token');
        localStorage.removeItem('login_type');
        localStorage.removeItem('cart_items_count');
        localStorage.removeItem('product_variant_seo_url');
        localStorage.removeItem('page_name');
        this.nav.setRoot('SigninPage');
    }

    goToPage(type)
    {
        this.menu.close();
        if(type == 1)
        {
          this.nav.setRoot('HomePage');
        }
        else if(type== 2)
        {
          this.nav.setRoot('ViewMainCategoriesPage');
        }
        else if(type== 3)
        {
          this.nav.setRoot('ViewMyCartPage');
        }
        else if(type== 4)
        {
          this.nav.setRoot('AccountPage');
        }
        else if(type== 5)
        {
          localStorage.removeItem('user_name');
          localStorage.removeItem('email');
          localStorage.removeItem('mobile');
          localStorage.removeItem('mobile_access_token');
          localStorage.removeItem('login_type');
          localStorage.removeItem('cart_items_count');
          localStorage.removeItem('product_variant_seo_url');
          localStorage.removeItem('page_name');
          this.nav.setRoot('SigninPage');
        }
    }

    openOrdersPage()
    {
        this.menu.close();
        this.nav.push('ViewOrdersPage');
    }

    whatsappShare() 
    {
        // Text + Image or URL works
        this.socialSharing.share('Download the Anythingelse app from given URL',null, null, 'https://play.google.com/store/apps/details?id=com.anythingelse.mobile').then(() => 
        {
            // Success
            console.log("Success");
        }).catch((e) => 
        {
            // Error!
            console.log("Error");
        });
    }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App, LoadingController,ToastController, AlertController  } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { CallNumber } from '@ionic-native/call-number';

import { BrowserTab } from '@ionic-native/browser-tab';

import { EmailComposer } from '@ionic-native/email-composer';

import { Http }  from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ModuleProvider } from '../../providers/module-service';

@IonicPage()
@Component
({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})

export class ContactUsPage 
{
    loadingModal: any;
    db_result: any;

    address1:string;
    address2:string;
    email:string;
    mobile:string;

    success_count:number;

    constructor(public navCtrl: NavController, public navParams: NavParams, private nativePageTransitions: NativePageTransitions,public platform: Platform,private iab: InAppBrowser,public _app: App,private callNumber: CallNumber,private browserTab: BrowserTab,private emailComposer: EmailComposer,public moduleService: ModuleProvider,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public alertCtrl: AlertController) 
    {
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

      /*this.loadingModal = this.loadingCtrl.create(
      {
          spinner:'hide',
          content: '<img src="assets/icon/loader.gif">',
          //dismissOnPageChange: true,
                enableBackdropDismiss: true
      });
      this.loadingModal.present();*/
      this.moduleService.view_contact_data().then((db_result: any) => 
      {
          this.db_result = db_result;
          if(db_result.status_code == 200)
          {
            this.address1 = db_result.address_1;
            this.address2 = db_result.address_2;
            this.email = db_result.email;
            this.mobile = db_result.mobile;
            this.success_count = 1;
            //this.loadingModal.dismiss();
          }
          else
          {
            this.success_count = 0;
            //this.loadingModal.dismiss();
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
          //this.loadingModal.dismiss();
      });
      console.log('ionViewDidLoad ContactUsPage');
    }

    ionViewWillEnter() 
    {
      localStorage.setItem('page_name', JSON.stringify('ContactUsPage'));
      let elements = document.querySelectorAll(".tabbar");

      if (elements != null) 
      {
          Object.keys(elements).map((key) => 
          {
              elements[key].style.display = 'none';
          });
      }


      console.log('ionViewWillEnter ContactUsPage');
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

    openEmailer(email_id)
    {
        this.emailComposer.isAvailable().then((available: boolean) =>
        {
            if(available) 
            {
                //Now we know we can send
            }
        });

        let email = 
        {
            to: email_id,
            subject: '',
            body: '',
            isHtml: true
        };

        // Send a text message using default options
        this.emailComposer.open(email);
    }

    openDialerPad(mobile_number)
    {
        this.callNumber.callNumber(mobile_number, true)
        .then(() => console.log('Launched dialer!'))
        .catch(() => console.log('Error launching dialer'));
    }
}

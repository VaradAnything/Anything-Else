import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,AlertController } from 'ionic-angular';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http }  from '@angular/http';
import { ModuleProvider } from '../../providers/module-service';
import { ScrollHideConfig } from '../../directives/scroll-hide/return-order-scroll-hide';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
    selector: 'page-return-order',
    templateUrl: 'return-order.html',
})

export class ReturnOrderPage 
{
    loadingModal: any;
    db_result: any;
    
  moduleForm: FormGroup;
    submitAttempt: boolean = false;

    orders_data_array: any;
    address_data: any;
    item_count: number;

    order_id : string = '';
    reason_type : string = '';
    order_status_code : number = 1;
    is_show_cancel_option : number = 0;
    is_show_cancel_order_reason : number = 0;

    slot_day : string = '';
    slot_time : string = '';
    order_date : string = '';
    order_status : string = '';
    order_status_color : string = '';
    sub_total_amount : string = '0';
    coupon_code_discount : string = '0';
    shipping_amount : string = '0';
    coupon_code : string = '';
    payment_method : string = '';
    total_amount : string = '0';
    is_coupon_apply : number = 0;
    success_count : number = 0;
    error_count : number = 0;
    total_wallet_amount : number = 0;

    footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 57 };
    
    //this.newArray : Array<{id: number, value: string}> = [];

    temp_orders_data_array: Array<{id: string,is_cancellable: string,is_returnable: string,order_date: string,order_id: string,order_status: string,order_status_code: string,order_status_color: string,order_unique_key : string,photo1 : string,price: string,product_name:string,return_reason:string,return_status:string,return_status_color:string,single_product_total_amount:string,single_product_total_quantity:string,single_product_total_return_quantity:string,single_product_total_quantity_array:any}> = [];
  
    public bills: any = [];

    public array: any = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public moduleService: ModuleProvider,public formBuilder: FormBuilder,public loadingCtrl: LoadingController,public toastCtrl: ToastController, private nativePageTransitions: NativePageTransitions,public alertCtrl: AlertController) 
  {
      this.navCtrl= navCtrl;
      this.http = http;

      this.order_id = this.navParams.get('order_id');
      this.order_status_code = this.navParams.get('order_status_code');
      this.order_date = this.navParams.get('order_date');
      this.order_status = this.navParams.get('order_status');
      this.order_status_color = this.navParams.get('order_status_color');

      this.bills.push({ id: 0, value: 'bill1'});
    this.bills.push({ id: 1, value: 'bill2'});
    this.bills.push({ id: 2, value: 'bill3'});
  }

  doRefresh(refresher)
  {
    setTimeout(() => 
    {
          this.ionViewWillEnter();
          refresher.complete();
      }, 1000);
  }


  ionViewWillEnter()
    {
      localStorage.setItem('page_name', JSON.stringify('ReturnOrderPage'));
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
      this.moduleService.view_return_order(mobile_access_token,this.order_id).then((db_result: any) => 
      {
          this.db_result = db_result;
          if(db_result.status_code == 200)
          { 
            this.item_count = 1;
                this.orders_data_array = db_result.data.user_order;
            this.total_wallet_amount = this.orders_data_array[0]['total_wallet_amount'];
            this.slot_day = this.orders_data_array[0]['slot_day'];
            this.slot_time = this.orders_data_array[0]['slot_time'];
            this.loadingModal.dismiss();

            for (var v in this.orders_data_array) 
            {
            this.temp_orders_data_array.push
                ({
                  id:  this.orders_data_array[v]['id'],
                  is_cancellable:  this.orders_data_array[v]['is_cancellable'],
                  is_returnable:  this.orders_data_array[v]['is_returnable'],
                    order_date:  this.orders_data_array[v]['order_date'],
                    order_id : this.orders_data_array[v]['order_id'],
                    order_status:  this.orders_data_array[v]['order_status'],
                    order_status_code : this.orders_data_array[v]['order_status_code'],
                    order_status_color : this.orders_data_array[v]['order_status_color'],
                    order_unique_key:  this.orders_data_array[v]['order_unique_key'],
                    photo1:  this.orders_data_array[v]['photo1'],
                    price : this.orders_data_array[v]['price'],
                    product_name : this.orders_data_array[v]['product_name'],
                    return_reason : this.orders_data_array[v]['return_reason'],
                    return_status : this.orders_data_array[v]['return_status'],
                    return_status_color : this.orders_data_array[v]['return_status_color'],
                    single_product_total_amount : this.orders_data_array[v]['single_product_total_amount'],
                    single_product_total_quantity : this.orders_data_array[v]['single_product_total_quantity'],
                    single_product_total_return_quantity : this.orders_data_array[v]['single_product_total_return_quantity'],
                    single_product_total_quantity_array : this.orders_data_array[v]['single_product_total_quantity_array'],
                });
            }
          }
          else
          {
            this.orders_data_array = '';
            this.slot_day = '';
            this.slot_time = '';
            this.item_count = 0;
            this.total_wallet_amount = 0;
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
              elements[key].style.display = 'flex';
          });
      }
    }

    onChangeQty(qty,id) : void 
    {
      for (var v in this.temp_orders_data_array) 
        {
          if(id == this.temp_orders_data_array[v]['id'])
          {
            this.temp_orders_data_array[v]['single_product_total_return_quantity'] = qty; 
            break;
          }
        }  
    }

    onChangeText(return_reason,id) : void 
    {
      for (var v in this.temp_orders_data_array) 
        {
          if(id == this.temp_orders_data_array[v]['id'])
          {
            this.temp_orders_data_array[v]['return_reason'] = return_reason; 
            break;
          }
        }
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

    returnOrder()
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
        'user_order': this.temp_orders_data_array,'order_id': this.order_id,'mobile_access_token': mobile_access_token
      };
      this.moduleService.update_return_order('', { form_data }).then((data: any) => 
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
                  //this.success_count = 1;
                  if(data.update == 1)
                  {
                    this.navCtrl.setRoot('ReturnPage');
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
                  this.success_count = 0;
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

    shopping()
    {
      this.navCtrl.setRoot('ViewMainCategoriesPage');
    }
}

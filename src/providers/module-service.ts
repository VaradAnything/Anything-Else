import { Injectable } from '@angular/core';
import {Http, Headers}  from '@angular/http';
//import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

import CryptoJS from 'crypto-js';

import { AppConfig } from '../app/app-config';

import { Storage } from '@ionic/storage';


@Injectable()
export class ModuleProvider 
{
    cachedData: any;
    //mobile_access_token : string = '';
    constructor(public appConfig: AppConfig,public http: Http,public storage: Storage) 
    {
        //this.mobile_access_token = JSON.parse(localStorage.getItem('mobile_access_token'));
    }

    signin(params, data) 
    {
        var service = this;
        let url = service.appConfig.Api_URL + "url=authentication/signin&type=json";
        url = this.initUrl(url, params);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    signup(params, data) 
    {
        var service = this;
        
        let url = service.appConfig.Api_URL + "url=authentication/signup&type=json";
        url = this.initUrl(url, params);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    forgot_password(params, data) 
    {
        var service = this;
        
        let url = service.appConfig.Api_URL + "url=authentication/forgot_password&type=json";
        url = this.initUrl(url, params);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    profile_forgot_password(params, data) 
    {
        var service = this;
        
        let url = service.appConfig.Api_URL + "url=authentication/update_mobile&type=json";
        url = this.initUrl(url, params);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    change_password(params, data) 
    {
        var service = this;
        
        let url = service.appConfig.Api_URL + "url=authentication/update_password&type=json";
        url = this.initUrl(url, params);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    add_review(params, data) 
    {
        var service = this;
        
        let url = service.appConfig.Api_URL + "url=review/add_edit&type=json";
        url = this.initUrl(url, params);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_review(product_seo_url,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=review/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ product_seo_url:product_seo_url,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    cancel_order(params, data) 
    {
        var service = this;
        
        let url = service.appConfig.Api_URL + "url=order/cancel&type=json";
        url = this.initUrl(url, params);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    add_without_login_cart_data(without_login_cart_data_array,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=review/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ session_cart_data:without_login_cart_data_array,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_catalogue_data(cat_id,sub_cat_id,sub_sub_cat_id,filter_expression,q,sort_by,page,price,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=product/list&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ cat_id:cat_id,sub_cat_id:sub_cat_id,sub_sub_cat_id:sub_sub_cat_id,filter_expression:filter_expression,q:q,sort_by:sort_by,page:page,price:price,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_product_details(product_variant_seo_url,mobile_access_token)
    {
        console.log("Hi1");
        console.log(product_variant_seo_url);
        var service = this;

        let url = service.appConfig.Api_URL + "url=product/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ product_variant_seo_url:product_variant_seo_url,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_checkout_data(mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=checkout/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    apply_remove_coupon_code(coupon_code,type,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=coupon/add_remove&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ coupon_code:coupon_code,coupon_applied:type,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    order_now(cart_data,address_id,payment_method_type,payment_id,type,days_title,slot_id,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=checkout/add&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ cart_data:cart_data,address_id:address_id,mode_of_payment:payment_method_type,payment_id:payment_id,type:type,days_title:days_title,slot_id:slot_id,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_home_data(mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=home/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        //let data='';
        let data=JSON.stringify({ mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_main_categories(mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=category/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        //let data='';
        let data=JSON.stringify({ mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_sub_categories(parent_id)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=category/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ parent_id:parent_id });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_cart(mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=cart/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    add_to_cart(product_seo_url,product_variant_seo_url,product_quantity,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=cart/add&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ product_seo_url:product_seo_url,product_variant_seo_url:product_variant_seo_url,product_quantity:product_quantity,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    remove_from_cart(product_seo_url,product_variant_seo_url,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=cart/remove&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ product_seo_url:product_seo_url,product_variant_seo_url:product_variant_seo_url,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    update_to_cart(product_seo_url,product_variant_seo_url,action,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=cart/update&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ product_seo_url:product_seo_url,product_variant_seo_url:product_variant_seo_url,action:action,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_wishlists(mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=wishlist/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    update_wishlists(product_seo_url,product_variant_seo_url,type,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=wishlist/add_remove&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ product_seo_url:product_seo_url,product_variant_seo_url:product_variant_seo_url,type:type,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_profile_data(mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=authentication/get_user_info&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_orders(mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=order/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_order_details(mobile_access_token,order_id)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=order/view&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ mobile_access_token:mobile_access_token,order_id:order_id });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_all_return_orders(mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=return/view&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_return_order(mobile_access_token,order_id)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=return/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ mobile_access_token:mobile_access_token,order_id:order_id });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    update_return_order(params, data) 
    {
        var service = this;
        let url = service.appConfig.Api_URL + "url=return/update&type=json";
        url = this.initUrl(url, params);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    add_address(params, data) 
    {
        var service = this;
        let url = service.appConfig.Api_URL + "url=address/add&type=json";
        url = this.initUrl(url, params);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    edit_address(params, data) 
    {
        var service = this;
        let url = service.appConfig.Api_URL + "url=address/update&type=json";
        url = this.initUrl(url, params);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_address_data(mobile_access_token,address_id)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=address/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ mobile_access_token:mobile_access_token,address_id:address_id });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    delete_address_data(mobile_access_token,address_id)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=address/delete&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ mobile_access_token:mobile_access_token,address_id:address_id });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_country_data(mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=others/get_country&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_state_data(country_id,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=others/get_state&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ country_id:country_id,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_city_data(country_id,state_id,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=others/get_city&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ country_id:country_id,state_id:state_id,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    get_slot(days_title,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=checkout/slot&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ days_title:days_title,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    edit_profile(params, data) 
    {
        var service = this;
        
        let url = service.appConfig.Api_URL + "url=authentication/update_account&type=json";
        url = this.initUrl(url, params);

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    } 

    check_location(country_code,country_name,postal_code,administrative_area,sub_administrative_area,locality,sub_locality,thorough_fare,latitude,longitude)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=location/get&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ country_code:country_code, country_name:country_name, postal_code:postal_code, administrative_area:administrative_area, sub_administrative_area:sub_administrative_area, locality:locality, sub_locality:sub_locality, thorough_fare:thorough_fare, latitude:latitude, longitude:longitude  });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_order_payment_status(checkout_unique_key,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=checkout/check_status&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ checkout_unique_key:checkout_unique_key,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    apply_wallet(is_wallet_apply,mobile_access_token)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=wallet/add_remove&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ is_wallet_apply:is_wallet_apply,mobile_access_token:mobile_access_token });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    view_contact_data()
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=account/contact&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    notify(mobile_access_token,product_id,product_variant_id)
    {
        var service = this;

        let url = service.appConfig.Api_URL + "url=notify/out_of_stock&type=json";
        url = this.initUrl(url, '');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let data=JSON.stringify({ mobile_access_token:mobile_access_token,product_id:product_id,product_variant_id:product_variant_id });

        return new Promise(function (resolve, reject) 
        {   
            service.http.post(service.initRequest(url, 'post'), data,{headers:headers}).catch(err => 
            {   
                reject('error');
                return Observable.throw(err);
            }).map(res => res.json()).subscribe(data => 
            {
                if (data) 
                {
                    service.cachedData = data;
                    resolve(service.cachedData);
                }
                else 
                {
                    reject();
                }
            });
        });
    }

    initUrl(url, params) 
    {
        if (params) 
        {
          var keys = Object.keys(params);

          for (var i = 0; i < keys.length; i++) 
          {
            if (i == 0) 
            {
              url += "?" + keys[i] + '=' + params[keys[i]];
            } 
            else 
            {
              url += '&' + keys[i] + '=' + params[keys[i]];
            }
          }
        }
        return url;
    }


    initRequest(url: string, method) 
    {
        
        if (this.isSSL(url)) 
        {
            if (url.indexOf('?') >= 0) 
            {
                url += '&consumer_key=' + this.appConfig.Shop_ConsumerKey + '&consumer_secret=' + this.appConfig.Shop_ConsumerSecret;
            }
            else 
            {
                url += '?consumer_key=' + this.appConfig.Shop_ConsumerKey + '&consumer_secret=' + this.appConfig.Shop_ConsumerSecret;
            }
            return url;
        }
        else 
        {
            let initParams: any = {};
            let retParams: any = {};
            initParams.url = url;
            initParams.method = method;
            initParams.data = 
            {
                oauth_consumer_key: this.appConfig.Shop_ConsumerKey,
                oauth_nonce: this.getNonce(),
                oauth_signature_method: this.appConfig.Shop_Signature_Method,
                oauth_timestamp: this.getTimeStamp(),
            };

            retParams.oauth_consumer_key = initParams.data.oauth_consumer_key;
            retParams.oauth_nonce = initParams.data.oauth_nonce;
            retParams.oauth_signature_method = initParams.data.oauth_signature_method;
            retParams.oauth_timestamp = initParams.data.oauth_timestamp;
            retParams.oauth_signature = this.authorize(initParams);
            
            if (url.indexOf('?') >= 0) 
            {
                url += '&';
            }
            else 
            {
                url += '?';
            }
            return url += 'oauth_consumer_key=' + initParams.data.oauth_consumer_key +
            '&oauth_nonce=' + initParams.data.oauth_nonce  +
            '&oauth_signature_method=' + initParams.data.oauth_signature_method +
            '&oauth_timestamp=' + initParams.data.oauth_timestamp +
            '&oauth_signature=' + encodeURIComponent(this.authorize(initParams));

        }
    }

    isSSL(str) 
    {
        var tarea = str;
        var tarea_regex = /^(https)/;
        if (tarea_regex.test(String(tarea).toLowerCase()) == true) 
        {
            return true;
        }
        return false;
    }

    getNonce() 
    {
        var word_characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var result = '';

        for (var i = 0; i < this.appConfig.Shop_Nonce_Length; i++) 
        {
            result += word_characters[parseInt(String(Math.random() * word_characters.length), 10)];
        }

        return result;
    }

    hash(base_string, key) 
    {
        switch (this.appConfig.Shop_Signature_Method) 
        {
            case 'HMAC-SHA1':
            return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
            case 'HMAC-SHA256':
            return CryptoJS.HmacSHA256(base_string, key).toString(CryptoJS.enc.Base64);
        }
    }

    getTimeStamp() 
    {
        return parseInt(String(new Date().getTime() / 1000), 10);
    }

    randomJsonpName() 
    {
        var str;
        str = new Date().getTime() + Math.round(Math.random() * 1000000);
        return str;
    };

    authorize(request) 
    {
        if (!request.data) 
        {
            request.data = {};
        }
        let oauth_signature = this.getSignature(request);
        return oauth_signature;
    }

    getSignature(request)
    {
        return this.hash(this.getBaseString(request), this.percentEncode(this.appConfig.Shop_ConsumerSecret) + '&');
    }

    getBaseString(request) 
    {   
        return request.method.toUpperCase() + '&' + this.percentEncode(this.getBaseUrl(request.url)) + '&' + this.percentEncode(this.getParameterString(request));
    }

    getBaseUrl(url) 
    {   
        return url.split('?')[0];
    }

    percentEncode(str) 
    {
        return encodeURIComponent(str)
        .replace(/\!/g, "%21")
        .replace(/\*/g, "%2A")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        ;
    }

    getParameterString(request) 
    {
        var base_string_data = this.sortObject(this.percentEncodeData(this.mergeObject(request.data, this.deParamUrl(request.url))));
        var data_str = '';
        for (var key in base_string_data) 
        {
            var value = base_string_data[key];
            if (value && Array.isArray(value)) 
            {
                value.sort();
                var valString = "";
                value.forEach((function (item, i) {
                valString += key + '=' + item;
                if (i < value.length) 
                {
                    valString += "&";
                }
                }).bind(this));
                data_str += valString;
            } 
            else 
            {
                data_str += key + '=' + value + '&';
            }
        }
        data_str = data_str.substr(0, data_str.length - 1);

        return data_str;
    }

    deParamUrl(url) 
    {
        var tmp = url.split('?');
        if (tmp.length === 1)
        return {};
        return this.deParam(tmp[1]);
    }

    deParam(param) 
    {
        var arr = param.split('&');
        var data = {};

        for (var i = 0; i < arr.length; i++) {
        var item = arr[i].split('=');
        data[item[0]] = decodeURIComponent(item[1]);
        }
        return data;
    }

    mergeObject(obj1, obj2) 
    {
        var merged_obj = obj1;
        for (var key in obj2) 
        {
            merged_obj[key] = obj2[key];
        }
        return merged_obj;
    }

    
    sortObject(data) 
    {
        var keys = Object.keys(data);
        var result = {};

        keys.sort();

        for (var i = 0; i < keys.length; i++) 
        {
            var key = keys[i];
            result[key] = data[key];
        }

        return result;
    }

    percentEncodeData(data) 
    {
        var result = {};
        
        for (var key in data) 
        {
            var value = data[key];
            if (value && Array.isArray(value)) 
            {
                var newValue = [];
                value.forEach((function (val) 
                {
                    newValue.push(this.percentEncode(val));
                }).bind(this));
                value = newValue;
            } 
            else 
            {
                value = this.percentEncode(value);
            }
                result[this.percentEncode(key)] = value;
        }

            return result;
    }


    

}

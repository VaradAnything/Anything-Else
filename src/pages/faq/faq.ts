import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})

export class FaqPage 
{
  	constructor(public navCtrl: NavController, public navParams: NavParams, private nativePageTransitions: NativePageTransitions) 
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
    	console.log('ionViewDidLoad FaqPage');
  	}

  	ionViewWillEnter()
  	{
  		localStorage.setItem('page_name', JSON.stringify('FaqPage'));
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

  	shownGroup = null;

	faqs = [
    { title: "1) How do I place an order?", description: "Ordering at Anythingelse.IN is easy. Placing your first order at Anythingelse.IN Just select the items  you want to shop enter your shipping address and payment information and you are home. If you  need any assistance give us a call. We would love to take your call to guide you to complete your  registration process." },
    { title: "2) How will my order be delivered to me?", description: "Your order would be delivered through our delivery boys at your doorstep." },
    { title: "3) How will I know if order is placed successfully? ", description: "Once your Order is successfully placed, you will receive a confirmation over email and text message  from Anythingelse.in This mail will have all the details related to your order. Order details can  also be viewed at My Account -> My Orders as you have placed the order on your own online." },
    { title: "4) Do you take orders over phone?", description: "No, we do not take orders over phone." },
    { title: "5) How do I check the status of my order?", description: "Your order status is updated to you via emails and sms at every step. Once your order is placed you  would receive an sms and an email with your order details. Again after your order is dispatched we  send you an sms with your tracking details. Please check your spam and old sms for the status of  your order, if you don't see any updates. In case of any unforeseen events which delay your order  you would receive a special update from our end." },
    { title: "6) Can I cancel my order?", description: "If you wish to cancel your order, get in touch with Customer Care as soon as possible with your  order number. As long as your order has not been dispatched we can cancel it.If your order has  been dispatched but yet to be delivered, please do not accept delivery and contact Customer Care  to inform them of the same. Any Taptoo Bazar Credits used in the purchase of the Order will be  credited back to your account." },
    { title: "7) I got a confirmation call for my order. Why is that?", description: "You receive a confirmation call for your order to verify if there isn't any change with your order." },
    { title: "8) Can I place a bulk order for an item(s)?", description: "In order to place a bulk order please drop a mail to info@Anythingelse.in with your requirements  and the concerned team would get back to you." },
    { title: "9) Can I add an item to my order after I have placed my order?", description: "Unfortunately no, however you can simply place another order." }
  ];

	toggleGroup(group) 
	{
	    if (this.isGroupShown(group)) 
	    {
	        this.shownGroup = null;
	    } 
	    else 
	    {
	        this.shownGroup = group;
	    }
	};
	isGroupShown(group) 
	{
	    return this.shownGroup === group;
	};
}

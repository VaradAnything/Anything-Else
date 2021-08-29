import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@IonicPage()
@Component
({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})

export class NotificationPage 
{
    item_count: number;
    is_show_notification_1: number = 1;
    is_show_notification_2: number = 1;
    is_show_notification_3: number = 1;
    is_show_notification_4: number = 1;
    is_show_notification_5: number = 1;
	constructor(public navCtrl: NavController, public navParams: NavParams, private nativePageTransitions: NativePageTransitions) 
	{
	}

	ionViewDidLoad() 
	{
        console.log('ionViewDidLoad NotificationPage');
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

	ionViewWillEnter()
    {
        this.item_count = 1;
        localStorage.setItem('page_name', JSON.stringify('NotificationPage'));
    }

    removeNotification(type)
    {
        if(type == 1)
        {
            this.is_show_notification_1 = 0;
        }
        else if(type == 2)
        {
            this.is_show_notification_2 = 0;
        }
        else if(type == 3)
        {
            this.is_show_notification_3 = 0;
        }
        else if(type == 4)
        {
            this.is_show_notification_4 = 0;
        }
        else if(type == 5)
        {
            this.is_show_notification_5 = 0;
        }
    }
}

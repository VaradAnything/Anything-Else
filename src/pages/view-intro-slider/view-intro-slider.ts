import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Slides } from 'ionic-angular';

@IonicPage()
@Component
({
  selector: 'page-view-intro-slider',
  templateUrl: 'view-intro-slider.html',
})

export class ViewIntroSliderPage 
{
    showSkip = true;

    @ViewChild('slides') slides: Slides;

    constructor(public navCtrl: NavController, public navParams: NavParams,private menu: MenuController) 
    {
    }

    ionViewDidLoad() 
    {
        this.menu.swipeEnable(false);
    }

    startApp() 
    {
        /*this.navCtrl.push(TabsPage).then(() => 
        {
            this.storage.set('hasSeenTutorial', 'true');
        })*/
        localStorage.setItem('is_seen_intro_slider', JSON.stringify(1));
        this.navCtrl.setRoot('SigninPage');
    }

    onSlideChangeStart(slider: Slides) 
    {
        this.showSkip = !slider.isEnd();
    }

    ionViewWillEnter()
    {
        this.slides.update();
        this.menu.swipeEnable(false);
        localStorage.setItem('page_name', JSON.stringify('ViewIntroSliderPage'));
    }

    ionViewWillLeave()
    {
        this.menu.swipeEnable(true);
    }

    openPage()
    {
      this.navCtrl.setRoot('SigninPage');
    }
}

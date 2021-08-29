import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@IonicPage()
@Component
({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})

export class FilterPage 
{
	filter_data_array : any;
	filter_reset : any;
	sub_filter_data:any;
	checked : number = 0;
	price_data_expand : number = 0;
	price_min_value : number = 0;
	price_max_value : number = 0;
	old_price_min_value : number = 0;
	old_price_max_value : number = 0;
	filter_title : string = 'Category';

	price_1:number = 100;
	price_2:number = 500;

	newItem: any;

	price_filter_data: any;
	

  	constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private alertCtrl : AlertController) 
  	{
  		this.filter_data_array = this.navParams.get('filter_data');
  		this.filter_reset = this.navParams.get('filter_reset');
  		this.price_min_value = this.navParams.get('price_min_value');
  		this.price_max_value = this.navParams.get('price_max_value');
  		this.old_price_min_value = this.navParams.get('price_min_value');
  		this.old_price_max_value = this.navParams.get('price_max_value');
  		this.price_1 = this.navParams.get('min_value');
  		this.price_2 = this.navParams.get('max_value');
  		this.price_filter_data = { lower: this.navParams.get('price_min_value'), upper: this.navParams.get('price_max_value') };
  	}

  	ionViewWillEnter() 
  	{ 
  		localStorage.setItem('page_name', JSON.stringify('FilterPage'));
  		//this.newItem = "<ion-item><ion-range dualKnobs='true' pin='true' min='0' max='2000' [(ngModel)]='price_filter_data' color='dark'><ion-icon range-left small name='brush'></ion-icon><ion-icon range-right name='brush'></ion-icon></ion-range></ion-item>";
  		this.price_filter_data = { lower: this.price_min_value, upper: this.price_max_value };
  		/*if(this.filter_reset == '0')
  		{
  			for (var v in this.filter_data_array) 
		    {
		    	this.filter_title = this.filter_data_array[0].title;
		    	var temp_sub_filter_data = this.filter_data_array[v];
		    	for(var v1 in temp_sub_filter_data.filter_data)
		    	{
		    		this.filter_data_array[v]['filter_data'][v1]['check'] = '0'; 
		    	}  	
		    }
  		}*/
  		for (var v in this.filter_data_array) 
	    {
	    	this.filter_title = this.filter_data_array[0].title;
	    	break; 	
	    }

		this.sub_filter_data = this.filter_data_array[0]['filter_data'];
  	}

  	chooseTab(position,expand,title,filter_data) 
  	{
	    this.filter_title = title;	   	
	    this.sub_filter_data = filter_data;	   	
	    for (var v in this.filter_data_array) 
	    {
      		if(v == position)
	      	{
      			if(expand == 0)
	          	{
	            	this.filter_data_array[v]['expand'] = '1';  
	          	}
	          	else if(expand == 1)
	          	{
	            	this.filter_data_array[v]['expand'] = '0';
	          	}
	      	}
	      	else
	      	{
    			this.filter_data_array[v]['expand'] = '0';
	      	}
	    }
	    this.price_data_expand = 0;
  	}

  	choosePriceTab(expand) 
  	{
	    this.price_data_expand = expand;	   	
	    for (var v in this.filter_data_array) 
	    {
    		this.filter_data_array[v]['expand'] = '0';
	    }
	    if(expand == 0)
	    {
	    	this.filter_data_array[0]['expand'] = '0';
	    }
	    this.sub_filter_data = '';
  	}

  	getCheck(title,position,current_status)
  	{
  		if(this.filter_title == 'Discount')
  		{
			for (var v in this.sub_filter_data) 
		    {
		    	if(position == v)
		    	{
		    		if(current_status == 0)
			  		{
			  			this.sub_filter_data[position]['check'] = 1;
			  		}
			  		else
			  		{
			  			this.sub_filter_data[position]['check'] = 0;
			  		}
		    	}
		    	else
		    	{
		    		this.sub_filter_data[v]['check'] = 0;
		    	}
		    }
  		}
	    else
	    {
	    	if(current_status == 0)
	  		{
	  			this.sub_filter_data[position]['check'] = 1;
	  		}
	  		else
	  		{
	  			this.sub_filter_data[position]['check'] = 0;
	  		}
	    }	
  	}

  	getPrice()
  	{
  		this.price_min_value = this.price_filter_data.lower;
  		this.price_max_value = this.price_filter_data.upper;
  	}

  	clearAll() 
  	{
  		for (var v in this.filter_data_array) 
	    {
	    	var temp_sub_filter_data = this.filter_data_array[v];
	    	for(var v1 in temp_sub_filter_data.filter_data)
	    	{
	    		this.filter_data_array[v]['filter_data'][v1]['check'] = '0'; 
	    	}  	
	    }
	    this.price_min_value = this.price_1;
	    this.price_max_value = this.price_2;
	    //this.price_min_value = this.old_price_min_value;
	    //this.price_max_value = this.old_price_max_value;
	    this.old_price_min_value = this.price_1;
	    this.old_price_max_value = this.price_2;
  	}

  	applyFilter() 
  	{	
  		var filter_expression = '';
  		for (var v in this.filter_data_array) 
	    {
	    	var temp_sub_filter_data = this.filter_data_array[v];
	    	for(var v1 in temp_sub_filter_data.filter_data)
	    	{
	    		var temp_check = temp_sub_filter_data.filter_data[v1]['check'];
	    		if(temp_check == 1)
	    		{
	    			filter_expression = filter_expression + temp_sub_filter_data['fixed_value'] + '&' + temp_sub_filter_data.filter_data[v1]['value'] + ',';
	    		} 
	    	}  	
	    }
    	var data = 
    	{
      		filter_expression : filter_expression,
      		price_min_value : this.price_min_value,
      		price_max_value : this.price_max_value,
      		page : 1
    	}
    	this.viewCtrl.dismiss(data);
  	}

  	closeModal() 
  	{
	    var data = 
	    {
	      	filter_expression : '',
	      	price_min_value : 0,
	      	price_max_value : 0,
	      	page : 0
	    }
	    this.viewCtrl.dismiss(data);
  	}
}

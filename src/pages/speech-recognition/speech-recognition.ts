import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Observable } from 'rxjs/Observable';
import { ChangeDetectorRef } from '@angular/core';

@IonicPage()
@Component
({
  selector: 'page-speech-recognition',
  templateUrl: 'speech-recognition.html',
})

export class SpeechRecognitionPage 
{
	matches: String[];
  	isRecording = false;

  	constructor(public navCtrl: NavController, private speechRecognition: SpeechRecognition, private plt: Platform, private cd: ChangeDetectorRef) 
  	{ 
  	}
 
  	isIos() 
  	{
    	return this.plt.is('ios');
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
	      	this.cd.detectChanges();
	    });
	    this.isRecording = true;
  	}

  	ionViewDidLoad() 
  	{
    	console.log('ionViewDidLoad SpeechRecognitionPage');
  	}
}

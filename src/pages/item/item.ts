import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Activity } from '../home/home';

@Component({
  selector: 'page-item',
  templateUrl: 'item.html'
})
export class ItemPage {
  activity: Activity;
  title: string;
  description: string;
  imgurl: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.activity = navParams.get('data');
    this.title = this.activity.title;
    this.imgurl = this.activity.imagePath;
    this.description = this.activity.description;
  }
  
}

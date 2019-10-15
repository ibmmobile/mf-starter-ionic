import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ItemPage } from '../item/item'

export class Activity {
  public title: string;
  public description: string;
  public imagePath: string;
  public id: string;

  constructor(name, description, imagePath, id) {
    this.title = name;
    this.description = description;
    this.imagePath = imagePath;
    this.id = id;
  }
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  activityList: Activity[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.activityList = [];
    this.initializeAnalytics();
  }

  ionViewDidLoad() {
   console.log('-->  ionViewDidLoad(): Page Succesfully loaded - Initialize JSONStore');
  }

  doRefresh(refresher) {
    var resourceRequest = new WLResourceRequest("/adapters/ResourceAdapter/getItems", WLResourceRequest.GET);
    resourceRequest.send().then ( (response) => { 
      var listOfWorkOrders = response.responseJSON.rows ; 
      this.activityList = [];
      listOfWorkOrders.forEach(item => {
              var activity = new Activity(item.doc.name, item.doc.description, item.doc.thumbnail, item.id);
              this.activityList.push(activity);
            });
      refresher.complete();
    },  (error) => {
      alert("Failure  " + JSON.stringify(error)); 
    }); 
  }

  openItem(activity) {
   console.log('-->  openItem(): Open item to view more detail');
    this.navCtrl.push(ItemPage, {
      data: activity
    });
  }

  logAnalytics(activity) {
   console.log('-->  logAnalytics(): Log completed tasks'); 
    WL.Analytics.log({"job" : 'Completed task : ' + activity.title});
    WL.Analytics.send();
  }

  registerPush() {
    MFPPush.registerDevice(
      null,
      function (successResponse) {
       console.log('-->  registerPush(): Successfully registered device');
      },
      function (failureResponse) {
       console.log('-->  registerPush(): Failed to register device:' + JSON.stringify(failureResponse));
      });
  }


  notificationReceived(message) {
    alert(JSON.stringify(message));
  };

  initializeAnalytics() {
    WL.Analytics.enable();
    WL.Analytics.log({"src" : 'Home landing page'});
    WL.Analytics.send();
  }

}

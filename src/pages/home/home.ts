import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

export class Activity {
  public title: string;
  public description: string;
  public imagePath: string;

  constructor(name, description, imagePath) {
    this.title = name;
    this.description = description;
    this.imagePath = imagePath;
  }
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  activityList: Activity[];
  completedList: Activity[];
  private dbname = 'activities';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.activityList = [];
    this.completedList = [];
    this.initializePush();
    this.initializeAnalytics();
  }

  ionViewDidLoad() {
   console.log('-->  ionViewDidLoad(): Page Succesfully loaded - Initialize JSONStore');
    var dbSchema = {
      activities: {
        searchFields: { name: 'string', description: 'string', thumbnail: 'string' },
        sync: {
          syncPolicy: 0,
          syncAdapterPath: 'JSONStoreCloudantSync'
        }
      }
    };
    WL.JSONStore.init(dbSchema, {}).then(
      (collection) => {
       console.log('-->  ionViewDidLoad(): JSONStore Initialization Success');
       console.log(JSON.stringify(collection));
      }, (error) => {
       console.log('-->  ionViewDidLoad(): JSONStore Initialization Failed :' + JSON.stringify(error));
      });
  }

  doRefresh(refresher) {
    var dbInstance = WL.JSONStore.get(this.dbname);
    dbInstance.sync().done(
      (success) => {
       console.log('-->  doRefresh(): JSONStore Sync Success');
        dbInstance.findAll(null).then(
          (data) => {
           console.log('-->  doRefresh(): JSONStore Documents Fetch Success');
            this.activityList = [];
            data.forEach(item => {
              var activity = new Activity(item.name, item.description, item.thumbnail);
              this.activityList.push(activity);
            });
            refresher.complete();
          });
      }, (error) => {
       console.log('-->  doRefresh(): JSONStore Sync Failed :' + JSON.stringify(error));
        refresher.complete();
      }
    );
  }

  removeItem(activity) {
   console.log('-->  removeItem(): Move item from Active to Complete Tab'); 
    this.logAnalytics(activity);
    this.completedList.push(activity);
    let index = this.activityList.indexOf(activity);
    if (index > -1) {
      this.activityList.splice(index, 1);
    }
  }

  logAnalytics(activity) {
   console.log('-->  logAnalytics(): Log completed tasks'); 
    WL.Analytics.log({"job" : 'Completed task : ' + activity.title});
    WL.Analytics.send();
  }

  initializePush() {
    MFPPush.initialize(
      function (successResponse) {
       console.log('-->  initializePush(): Failed to initialize');
        this.registerDevice()
        MFPPush.registerNotificationsCallback(this.notificationReceived);
      }, function (failureResponse) {
       console.log('-->  initializePush(): Failed to initialize' + JSON.stringify(failureResponse));
      });
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

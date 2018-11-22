import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

export class Activity {
  public title: string;
  public description: string;
  public imagePath: string;
  
  constructor(name, description , imagePath) {
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
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.activityList = [];
    this.completedList = [];
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad activityListPage');
      var dbSchema = {
        activities : {
          searchFields: {name: 'string', description: 'string', thumbnail: 'string'},
          sync: {
            syncPolicy: 0, 
            syncAdapterPath: 'JSONStoreCloudantSync'
          }
        }
      };
      WL.JSONStore.init(dbSchema, {}).then(
        (collection) => {
          console.log(JSON.stringify(collection));
        }, (error) => {
          console.log('Sync Failed');
      });  
    }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    var dbInstance = WL.JSONStore.get("activities")
    dbInstance.sync().done(
      (success) => {
        dbInstance.findAll(null).then(
          (data) => {
            this.activityList = [];
            data.forEach( item => {
              var activity = new Activity(item.name,item.description,item.thumbnail);
              this.activityList.push(activity);
              refresher.complete();
            });
            console.log(JSON.stringify(data));
          } 
        )
      }, (error) => {
        refresher.complete();
      }
    );
  }

  removeItem(activity) {
    this.completedList.push(activity);
    let index = this.activityList.indexOf(activity);
    if(index > -1){
      this.activityList.splice(index, 1);
    }
  }

}

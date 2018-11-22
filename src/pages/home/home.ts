import { Component } from '@angular/core';
import { NavController, NavParams, Col } from 'ionic-angular';

export class Activity {
  public imagePath: string;
  public name: string;
  public address: string;
  public phone: string;
  
  constructor(name, address, phone, imagePath) {
    this.name = name;
    this.address = address;
    this.phone = phone;
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
  moreCountries:any;
  countryCount = 0;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.activityList = [];
      this.completedList = [];
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad activityListPage');
      this.moreCountries=["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"]
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
    WL.JSONStore.get("activities").sync().done(
      (success) => {
        var activity = new Activity(this.moreCountries[this.countryCount],this.moreCountries[this.countryCount],this.moreCountries[this.countryCount],'https://s3.amazonaws.com/uifaces/faces/twitter/hai_ninh_nguyen/128.jpg');
        this.activityList.push(activity)
        this.countryCount = this.countryCount + 1;
        refresher.complete();
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

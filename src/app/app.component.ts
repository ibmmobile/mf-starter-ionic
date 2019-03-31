import { Component, Renderer } from '@angular/core';
import { Platform, App, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { LoginPage } from '../pages/login/login';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;
  public UserLoginChallengeHandler: WL.Client.SecurityCheckChallengeHandler; 

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, renderer: Renderer, public appCtrl: App, public alertCtrl: AlertController, public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // register mfp init function after plugin loaded
    renderer.listenGlobal('document', 'mfpjsloaded', () => {
      WL.Logger.debug('--> MobileFirst API plugin init complete');
      this.MFPInitComplete();
    });
  }

  // MFP Init complete function
  MFPInitComplete() {
    WL.Logger.debug('--> MFPInitComplete function called');
    this.registerChallengeHandler();  // register a ChallengeHandler callback for UserLogin security check
  }

  registerChallengeHandler() {
    this.UserLoginChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("UserLogin");
    this.UserLoginChallengeHandler.handleChallenge = ((challenge: any) => {
      WL.Logger.debug('--> UserLoginChallengeHandler.handleChallenge called');
      this.displayLoginChallenge(challenge);
    });
  }

  displayLoginChallenge(response) {
    if (response.errorMsg) {
      var msg = response.errorMsg + ', Remaining attempts: ' + response.remainingAttempts;
      WL.Logger.debug('--> displayLoginChallenge ERROR: ' + msg);
      this.events.publish('mfp:challenge', msg, this.UserLoginChallengeHandler);
    } else {
      this.events.publish('mfp:challenge', 'Invalid Credentials', this.UserLoginChallengeHandler);
    }
  }
}

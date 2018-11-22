import { Component, NgZone } from '@angular/core';
import { App, Events } from 'ionic-angular';
import { HomePage } from '../home/home'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  private securityCheck = 'UserLogin';
  private UserLoginChallengeHandler: WL.Client.SecurityCheckChallengeHandler; 
  private isChallenged = false;
  public result: string;
  username: string;
  password: string;

  constructor(public app: App, private zone: NgZone, public events: Events) {
    events.subscribe('mfp:challenge', (msg , challengeHandler) => {
      this.isChallenged = true;
      this.UserLoginChallengeHandler = challengeHandler;
      this.updateResult(msg);
    });
  }

  login() {
    var credentials = {
      username: this.username,
      password: this.password
    };
    if (!this.isChallenged) {
      WLAuthorizationManager.login(this.securityCheck, credentials).then(
        () => {
          console.log('-->  login(): Success ');
          this.app.getRootNav().setRoot(HomePage);
        }, (error) => {
          console.log('-->  login(): Failure ', JSON.stringify(error));
          this.updateResult('Login Failure : ' + error.errorMsg);
        });
    } else {
      this.UserLoginChallengeHandler.submitChallengeAnswer(credentials);
      this.isChallenged = false;
    }
  }

  public updateResult(msg: string) {
    this.zone.run(() => {
      this.result = msg;
      // Clear text boxes
      this.username = "";
      this.password = "";
    });
  }
  
}

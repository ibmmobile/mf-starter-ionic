import { Component } from '@angular/core';
import { App, MenuController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';

/**
 * Generated class for the HeaderMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header-menu',
  templateUrl: 'header-menu.html'
})
export class HeaderMenuComponent {

  private securityCheck = "UserLogin"

  constructor(public app: App, public menuCtrl: MenuController,) {
    console.log('Hello HeaderMenuComponent Component');
  }

  logout() {
    WLAuthorizationManager.logout(this.securityCheck).then(
      () => {
        console.log('-->  logout(): Success ');
        this.menuCtrl.close();
        var nav = this.app.getRootNav();
        nav.setRoot(LoginPage);
      }, (error) => {
        this.menuCtrl.close();
        console.log('-->  logout(): Failure ' + JSON.stringify(error));
      }
    );
  }

}

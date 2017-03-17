import { Component } from '@angular/core';
import { MainmenuService } from "./mainmenu.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {

  public isNewUser: boolean;
  public isMainMenuPage: boolean;

  constructor( private _menuService: MainmenuService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute ) {


    this.isNewUser = this._checkIsNewUser();
    this.isMainMenuPage  = this._getUrlActivatedRoute();

    //set value to show or not intro
    let isShowInfoForNewUserSubscribe: Subscription = this._menuService.isHideIntroForUser.subscribe((result) => {
      this.isMainMenuPage = result;
    });

   }

  private _checkIsNewUser():boolean {
    if (this._menuService.getLocalStorageValue("username")) {
       this._router.navigate(['mainmenu/single']);
       return false;
    } else {
      return true;
    }
  }

  private _getUrlActivatedRoute():boolean {
    return this._activatedRoute.snapshot.url.join('') === "mainmenu";
  }

}

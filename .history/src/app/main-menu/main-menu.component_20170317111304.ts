import { Component } from '@angular/core';
import { MultiplayerService } from "./multiplayer-menu/multiplayer.service";
import { MainmenuService } from "./mainmenu.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FirebaseService } from "../firebase.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {

  public isNewUser: boolean;
  public currentPage: boolean;
  public userName: string;
  public isWait:boolean = false;
  public shareAbleLink: string = "";
  public multiSubscribe: Subscription;

  constructor( private _menuService: MainmenuService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute ) {


    //set value to show or not intro
    let isShowInfoForNewUserSubscribe: Subscription = this._menuService.isHideIntro.subscribe((result) => {
      this.currentPage = result;
    });

    this.isNewUser = this._checkUser();
    this.currentPage  = this._checkRouter();
   }

   ngOnInit() {
   }

  private _checkUser():boolean {
    if (this._menuService.getLocalStorageValue("username")) {
       this._router.navigate(['mainmenu/single']);
       return false;
    } else {
      return true;
    }
  }

  private _checkRouter():boolean {
    return this._activatedRoute.snapshot.url.join('') === "mainmenu";
  }

}

import { Component } from '@angular/core';
import { MainmenuService } from "./mainmenu.service";
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {

  public isNewUser: boolean;
  public isMainMenuPage: boolean;

  public isWait:boolean = false;
  public shareAbleLink: string = "";
  private _waitForUserSubscriber: Subscription;


  constructor(private _menuService: MainmenuService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _af : AngularFire ) {

    this.isNewUser = this._checkIsNewUser();
    this.isMainMenuPage  = this._getUrlActivatedRoute();

    //set value to show or not intro
    let isShowInfoForNewUserSubscribe: Subscription = this._menuService.isHideIntroForUser.subscribe((result) => {
      this.isMainMenuPage = result;
    });

    //if user created a multiplayer game
    this._waitForUserSubscriber = this._menuService.waitForSecondUserMultiplayer.subscribe((id) => {
      this.isWait = true;

      let base = document.querySelector('base').getAttribute("href") || "/";
      this.shareAbleLink = window.location.origin.concat(base, "mainmenu/multi/", id);

    });

    // event on starting game
    let startGameSubscriber: Subscription = this._menuService.startPlayingGame.subscribe( (id) => {
      startGameSubscriber.unsubscribe();
      isShowInfoForNewUserSubscribe.unsubscribe();
     // this._router.navigate(['playzone', id]);  // send user  on game-field
     console.log("game start");
    });

   }

   ngOnInit() {
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

   public goToMainMenu(): void{
    let array:string[] = this.shareAbleLink.split("/");
    this._af.database.object(`rooms/${array[array.length-1]}`).remove()
      .then(() => {
        this.isWait = false;
        this._router.navigate(['mainmenu/single']);
      })
  }

}

import { Component } from '@angular/core';
import { CreateGameService } from "./create-game.service";
import { LocalStorageService } from "../local-storage.service";
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


  constructor(private _creategameService: CreateGameService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _localSrorage: LocalStorageService,
              private _af : AngularFire ) {

    this.isNewUser = this._checkIsNewUser();
    this.isMainMenuPage  = this._getUrlActivatedRoute();

    //set value to show or not intro
    let isShowInfoForNewUserSubscribe: Subscription = this._creategameService.isHideIntroForUser.subscribe((result) => {
      this.isMainMenuPage = result;
    });

    //if user created a multiplayer game
    this._waitForUserSubscriber = this._creategameService.waitForSecondUserMultiplayer.subscribe((id) => {
      this.isWait = true;
      this.shareAbleLink  = this._creategameService.getShariableLink(id);
    });

    // event on starting game
    let startGameSubscriber: Subscription = this._creategameService.startPlayingGame.subscribe( (id) => {
      startGameSubscriber.unsubscribe();
      isShowInfoForNewUserSubscribe.unsubscribe();
     // this._router.navigate(['playzone', id]);  // send user  on game-field
      console.log("game start");
    });

   }

   ngOnInit() {
   }

  private _checkIsNewUser():boolean {
    if (this._localSrorage.getLocalStorageValue("username")) {
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

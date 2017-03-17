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
              private _multiService: MultiplayerService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _firebase:FirebaseService ) {

    this.multiSubscribe = this._menuService.sendToMultiplater.subscribe((id) => {
      this.isWait = true;

      let room = this._firebase.getRoomByIdFromFB(id).subscribe(data => {
        if (data.$value === null) return;
        let base = document.querySelector('base').getAttribute("href") || "/";
        this.shareAbleLink = window.location.origin.concat(base, "mainmenu/multi/", id);
        if (data.users.length === 2) {
          room.unsubscribe();
          isShowInfoForNewUserSubscribe.unsubscribe();
          this._router.navigate(['playzone', id]);
        }
      });
    });

    let card: Subscription = this._menuService.startPlayingGame.subscribe( (id) => {
      card.unsubscribe();
      isShowInfoForNewUserSubscribe.unsubscribe();
      this._router.navigate(['playzone', id]);
    });

    //set value to show or not intro
    let isShowInfoForNewUserSubscribe: Subscription = this._menuService.isHideIntro.subscribe((result) => {
      this.currentPage = result;
    });

    this.isNewUser = this._checkUser();
    this.currentPage  = this._checkRouter();
   }

   ngOnInit() {
     this._activatedRoute.params.forEach((param: Params) => {
      let idRoom:number = param['id'];
        if (idRoom) {
          this._multiService.checkIfShareAbleLink(idRoom);
        }
    });
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

  public goToMainMenu(): void{
    let array:string[] = this.shareAbleLink.split("/");
    this._firebase.deleteRoom(array[array.length-1])
      .then(() => {
        this.isWait = false;
        this._router.navigate(['mainmenu/single']);
      })
  }

}

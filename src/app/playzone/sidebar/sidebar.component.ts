import { Component, OnDestroy } from '@angular/core';
import { SidebarService } from "./sidebar.service"
import { Subscription } from "rxjs";
import { LocalStorageService } from '../../local-storage.service'
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnDestroy{

  private _roomId:number;
  private _roomSubscriber:Subscription;
  private _userSubscriber:Subscription;
  private _timeSubscriber:Subscription;
  public firstUser: TUser = {name: "", score: 20, isActive: false, id: 0, result: "lose"};
  public secondUser: TUser = {name: "Unknow", score: 20, isActive: false, id: 1, result: "lose"};
  public multi:boolean;
  public time:number;
  private onBeforeUnloadHandler:EventListener;
  private onUnloadHandler:EventListener;


  constructor(
    private _sidebarService: SidebarService,
    private _activatedRoute: ActivatedRoute,
    private _localStorageService: LocalStorageService,
  ) {

    let localStorage:string = this._localStorageService.getLocalStorageValue("user");
    if(localStorage) this.firstUser.name = JSON.parse(localStorage).username;

    this.time = 0;

    this._activatedRoute.params.forEach((param: Params) => {
      this._roomId = param['id'];
    });

    this._roomSubscriber = this._sidebarService.roomObservable
      .take(1)
      .subscribe((options) => {
        this._setSidebar(options);
        this._sidebarService.initTimer(options);
      });

    this._timeSubscriber = this._sidebarService.timeSendObservable.subscribe( (number) => {
      this.time = number;
    });

    this._userSubscriber = this._sidebarService.usersObservable.subscribe((users) => {

      this._changeUsersState(users);
    });

    this.onBeforeUnloadHandler = this._onBeforeUnload;
    this.onUnloadHandler = this._onUnload.bind(this);


    addEventListener("beforeunload",  this.onBeforeUnloadHandler);
    addEventListener("unload",  this.onUnloadHandler);
  }


  ngOnDestroy(){
    this._roomSubscriber.unsubscribe();
    this._userSubscriber.unsubscribe();
    this._timeSubscriber.unsubscribe();
    this._sidebarService.stopTimer();
    removeEventListener("beforeunload",  this.onBeforeUnloadHandler);
    removeEventListener("unload",  this.onUnloadHandler);
  }


  private _onBeforeUnload(e: Event):void {
    e.returnValue = true;
    return
  }


  private _onUnload ():void {
    removeEventListener("beforeunload",  this.onBeforeUnloadHandler);
    removeEventListener("unload",  this.onUnloadHandler);
    this.goToMainMenu();
  }


  private _setSidebar(options:TStoreData):void {
    (options.type !== "single") ? this.multi = true : this.multi = false;
    this.firstUser = options.users[0];
    if (options.users.length > 1) this.secondUser = options.users[1];
  }


  private _changeUsersState(users:TUser[]):void {

    if (this.multi === false) {
      this.firstUser = users[0];
    } else {
      [this.firstUser, this.secondUser] = users;
    }
  }


  public goToMainMenu(): void{
    this._sidebarService.goToMainMenu.emit();
  }
}

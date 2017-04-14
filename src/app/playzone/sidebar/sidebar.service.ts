import { Injectable, EventEmitter } from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class SidebarService {

  public timeSendObservable: Observable<number>;
  public timeIsUpObservable: Observable<boolean>;
  public usersObservable: Observable<TUser[]>;
  public roomObservable: Observable<TStoreData>;
  public goToMainMenu: EventEmitter<any>;


  private _timeSend: EventEmitter<any>;
  private _timeIsUp: EventEmitter<boolean>;
  private _users: EventEmitter<TUser[]>;
  private _room: EventEmitter<TStoreData>;


  private _timerId:any;
  private _time:number;
  private _startTime:number;
  private _activeUser:TUser;
  private _currentUserId:number;

  private readonly _timeDuration:{small:number, medium:number, large:number, multi:number} = {
    small: 3000,
    medium: 120000,
    large : 180000,
    multi: 7000,
  };


  constructor() {
    this._timeSend = new EventEmitter();
    this.timeSendObservable = this._timeSend.asObservable();

    this._timeIsUp = new EventEmitter();
    this.timeIsUpObservable = this._timeIsUp.asObservable();

    this._users = new EventEmitter();
    this.usersObservable = this._users.asObservable();

    this._room = new EventEmitter();
    this.roomObservable = this._room.asObservable();

    this.goToMainMenu = new EventEmitter();
  }


  public initSidebar(options:TStoreData):void {
    this._room.emit(options);
    this._currentUserId = +sessionStorage['userid'];
    this._getActiveUser(options.users);
  }


  public changeUserState(users:TUser[]):void {
    this._users.emit(users);
    this._getActiveUser(users);
  }


  private _getActiveUser(users:TUser[]):void {
    users.forEach((user) => {
      if (user.isActive === true){
        if(this._activeUser && user.id !== this._activeUser.id){
          this.stopTimer();
          this.startTimer();
        }
        this._activeUser = Object.assign({}, user);
      }
    });
  }


  public initTimer(options:TStoreData):void {
    if (options.type === "multi") {
      this._startTime = this.setDurationOfTime(options.type)
    } else {
      this._startTime = this.setDurationOfTime(options.difficulty)
    }
    this.startTimer();
  }


  private setDurationOfTime(difficult:string):number {
    return this._timeDuration[difficult];
  }


  private changeTime():void {
    if (!this._time) {
      this.stopTimer();
      if (this._activeUser.id === this._currentUserId) this._timeIsUp.emit(true);
      else this._timeIsUp.emit(false);
    } else {
      this._time =  this._time - 1000;
      this._timeSend.emit(this._time);
    }
  }


  public startTimer ():void {
    this._time = this._startTime;
    this._timeSend.emit(this._time);
    this._timerId = setInterval(() => this.changeTime(), 1000);
  }


  public stopTimer():void {
    clearInterval(this._timerId);
  }

}

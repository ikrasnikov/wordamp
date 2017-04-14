import { Subscription, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DBService } from '../db.service';
import { Router } from '@angular/router';
import { SidebarService } from './sidebar/sidebar.service';

@Injectable()
export class GamePlayService {

  private _roomId: number;
  private _users: TUser[] = [];
  private _cards: TCard[];
  private _gameType: string;
  private _activeCards: TCard[];

  public countHiddenBlock: number;
  private _currentUser: TUser;
  private _timerId: any;
  private _timerDisconnect: any;
  private _roomSubscriber: Subscription;
  private _timeSubscriber: Subscription;
  private _firstDataSubscriber: Subscription;
  private _goToMainMenuSubscriber: Subscription;

  private _userIsLeft: boolean = false;

  public _roomObservable;
  private _sessionStorageUser: string;
  private _localStorageUser: any;

  public startGame: Subject<any>;
  public updateField: Subject<any>;
  public streamFromFirebase: Subject<any>;
  public pause: Subject<any>;
  public showPopup: Subject<any>;


  constructor(
    private _dbService: DBService,
    private _router: Router,
    private _sidebarService: SidebarService) {
    this.startGame = new Subject();
    this.updateField = new Subject();
    this.pause = new Subject();
    this.showPopup = new Subject();
  }


  public initNewGame(roomId: number): void{

    this._roomId = roomId;
    this._userIsLeft = false;
    this._sessionStorageUser = sessionStorage['userid'];
    this._localStorageUser = localStorage['user'] ? JSON.parse(localStorage['user']) : null;

    this.streamFromFirebase = new Subject();
    this._firstDataSubscriber = this.streamFromFirebase
      .subscribe(data => {

        if (!data.cards ||
          (data.users.length === 2 && this.checkNewUser(data.users)) ||
          (data.type === 'single' && this.checkNewUser(data.users))) {
          this._firstDataSubscriber.unsubscribe();
          this._router.navigate(['mainmenu']);
          return;
        }
        this._initData(data);
        data.type === 'multi' ? this._initMultiPlayerGame(data) : this._initSinglePlayerGame(data);
      });

    this._roomObservable = this._dbService.getObjectFromFireBase(`rooms/${roomId}`)
      .subscribe(this.streamFromFirebase);
  }


  private _initMultiPlayerGame(data: TStoreData): void{
    if(data.users.length < 2){
      this.checkNewUser(data.users) ? this._createNewUser() : this.showPopup.next('showPopup');
    }
    else {
      this._initSidebar(data);

      this.startGame.next({
        cards: data.cards,
        user: this._currentUser,
        difficulty: data.difficulty,
        activeCards: data.activeCards,
      });
      this.showPopup.next('');
      this._roomSubscriber = this.streamFromFirebase.subscribe((res) => this._updateLocalState(res));
      this._firstDataSubscriber.unsubscribe();
    }
  }


  private _initSinglePlayerGame(data: TStoreData): void{
    this._initSidebar(data);
    this.startGame.next({
      cards: data.cards,
      user: this._currentUser,
      difficulty: data.difficulty,
      activeCards: data.activeCards,
    });
    this._firstDataSubscriber.unsubscribe();
    this._roomSubscriber = this.streamFromFirebase.subscribe((res) => this._updateLocalState(res));
  }


  private _createNewUser(): void{
    let newID = Date.now().toString();
    sessionStorage['userid'] = newID;
    this._sessionStorageUser = newID;
    let name = this._localStorageUser ? this._localStorageUser.username : 'Unknown';
    this._currentUser = {
      id: +newID,
      isActive: false,
      name: name,
      result: "lose",
      score: 20
    };
    this._users.push(this._currentUser);
    this._dbService.updateStateOnFireBase(this._roomId, this._cards, this._activeCards, this._users, this.countHiddenBlock);
  }


  private checkNewUser(users: TUser[]): boolean{
    if(!this._sessionStorageUser) return true;
    let localStorageUserId: number = +this._sessionStorageUser ;
    let result = users.filter((user) => +user.id === localStorageUserId);
    return result.length === 0;
  }


  private _initData(data: TStoreData): void {
    this._cards = data.cards;
    this._users = data.users;
    this._gameType = data.type;
    this.countHiddenBlock = data.countHiddenBlock;
    this._activeCards = data.activeCards || [];
    let sessionStorageUserId: number = +this._sessionStorageUser;

    if(this._sessionStorageUser){
      data.users.forEach(user => {
        if (user.id === sessionStorageUserId) {
          this._currentUser = Object.assign({}, user)
        }
      });
    }

  }


  private _initSidebar(data: TStoreData): void {

    this._sidebarService.initSidebar(data);

    this._goToMainMenuSubscriber = this._sidebarService.goToMainMenu.subscribe(() => this.goToMainMenu());

    this._timeSubscriber = this._sidebarService.timeIsUpObservable.subscribe((activeUser) => {
      if (this._gameType === 'single') {
        this.endGame();
      }
      else if (this._gameType === 'multi') {

        if (activeUser) {
          if (this._timerId) clearTimeout(this._timerId);
          this._currentUser.score -= 5;
          this._changeUserScore();

          this.pause.next();
          this._users.forEach(user => user.isActive = !user.isActive);
          this._activeCards.forEach(card => card.isOpen = false);
          this._dbService.updateStateOnFireBase(this._roomId, this._cards, this._activeCards, this._users, this.countHiddenBlock);
        }
        else {
          this._timerDisconnect = setTimeout(() => this.showPopup.next('endGame'), 5000);
        }
      }
    });
  }


  private _updateLocalState(data: TStoreData): void {

    clearTimeout(this._timerDisconnect);

    if (!data.cards) {
      if(this._users.length === 2) {
        this._sidebarService.stopTimer();
        if(!this._userIsLeft)this.showPopup.next('endGame');
      }
      else {
        this._router.navigate([`mainmenu`]);
      }
      return;
    }

    let activeCards = Array.isArray(data.activeCards) ? data.activeCards.filter(item => item) : [];

    this._activeCards = activeCards.map(card => Object.assign({}, card));
    this._users = data.users.map(user => Object.assign({}, user));
    this.countHiddenBlock = data.countHiddenBlock;

    this.updateActivityForCurrentUser(data.users);
    this._sidebarService.changeUserState(data.users);
    this._changeStateByOpendCards(activeCards);

    this.updateField.next({
      activeCards: activeCards,
      user: this._currentUser
    });

  }


  private _changeStateByOpendCards(activeCards: TCard[]): void {
    switch (activeCards.length) {
      case 0:
        if (!this._currentUser.isActive) {
          this._updateCards(activeCards);
        }
        break;
      case 1:
        if (!this._currentUser.isActive) {
          this._updateCards(activeCards);
          if (!activeCards[0].isOpen) this._timerId = setTimeout(() => this._dbService.updateStateOnFireBase(this._roomId, this._cards, [], this._users, this.countHiddenBlock), 500);
        }
        break;
      case 2:
        this._isWin(this._cards);
        if (!activeCards[0].isOpen || activeCards[0].isHide) {
          if(this._gameType === 'multi'){
            this._sidebarService.stopTimer();
            this._sidebarService.startTimer();
          }
          if (this._currentUser.isActive) {
            this._timerId = setTimeout(() => {
              this._dbService.updateStateOnFireBase(this._roomId, this._cards, [], this._users, this.countHiddenBlock);
            }, 500);
          }
        }
    }

  }


  private updateActivityForCurrentUser(users: TUser[]): void {
    users.forEach(user => {
      if (user.id === this._currentUser.id) this._currentUser.isActive = user.isActive;
    });
  }


  public prepareNewState(activeCards: TCard[]): void {
    if (activeCards.length === 2) {
      this._checkActiveCards(activeCards);
    }
    this._updateCards(activeCards);
    this._dbService.updateStateOnFireBase(this._roomId, this._cards, activeCards, this._users, this.countHiddenBlock);
  }


  private _checkActiveCards(activeCards: TCard[]): void {
    if (activeCards[0].wordId === activeCards[1].wordId) {
      activeCards[0].isHide = true;
      activeCards[1].isHide = true;
      this._currentUser.score += 10;
      this.countHiddenBlock += 1;
      if (this._gameType === 'multi') this._sidebarService.stopTimer();
    } else {
      this._timerId = setTimeout(() => {
        if (this._gameType === 'multi') this._users.forEach(user => user.isActive = !user.isActive);
        activeCards.forEach(card => card.isOpen = false);
        this._dbService.updateStateOnFireBase(this._roomId, this._cards, activeCards, this._users, this.countHiddenBlock);
      }, 500);
      this._currentUser.score -= 1;
    }
    this._changeUserScore();
  }


  private _changeUserScore(): void {
    this._users.forEach(user => {
      if (user.id === this._currentUser.id) {
        user.score = this._currentUser.score;
        if (user.score < 0){
          this._currentUser.score = 0;
          user.score = 0;
        }
      }
    });
  }


  private _updateCards(activeCards: TCard[]): void {
    this._activeCards = activeCards;
    this._cards.forEach(card => {
      activeCards.forEach(activeCard => {
        if (card.id === activeCard.id) {
          card.isOpen = activeCard.isOpen;
          card.isHide = activeCard.isHide;
        }
      });
    });
  }


  private _isWin(cells: TCard[]): void {
    if (this.countHiddenBlock === (cells.length / 2) ) {
      if (this._gameType === 'multi') {
        let diff: number = this._users[0].score - this._users[1].score;
        switch (diff) {
          case 0:
            this._users[0].result = 'draw';
            this._users[1].result = 'draw';
            break;
          case Math.abs(diff):
            this._users[0].result = 'win';
            break;
          default:
            this._users[1].result = 'win';
            break;
        }
      }
      else this._users[0].result = 'win';
      this.endGame();
    }
  }


  public goToMainMenu(): void{
    this._userIsLeft = true;
    this._dbService.deleteRoomOnFireBase(this._roomId)
      .then(() => this._router.navigate([`mainmenu`]))
  }


  public endGame(): void {
    this._sidebarService.stopTimer();
    this._dbService.updateStateOnFireBase(this._roomId, this._cards, [], this._users, this.countHiddenBlock)
      .then(() => this._router.navigate([`playzone/${this._roomId}/result`]));

  }


  public removeSubscriptions(): void {
    this._sidebarService.stopTimer();
    clearTimeout(this._timerId);
    clearTimeout(this._timerDisconnect);
    this._timeSubscriber.unsubscribe();
    this._roomSubscriber.unsubscribe();
    this.streamFromFirebase.unsubscribe();
    this._roomObservable.unsubscribe();
    this._goToMainMenuSubscriber.unsubscribe();
  }

}

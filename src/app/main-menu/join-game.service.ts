import { Injectable } from '@angular/core';
import { CreateGameService } from "./create-game.service";
import { LocalStorageService } from "../local-storage.service";
import { Subscription, Observable } from "rxjs";
import { DBService } from '../db.service';
import { Router } from '@angular/router';

@Injectable()
export class JoinGameService {

  public imageOfLanguages: TItemLang[] = [
    {
      src: "assets/img/icons/germany.svg",
      name: "de"
    },
    {
      src: "assets/img/icons/united-kingdom.svg",
      name: "en"
    },
    {
      src: "assets/img/icons/russia.svg",
      name: "ru"
    },
    {
      src: "assets/img/icons/netherlandish.svg",
      name: "nl"
    }
  ];


  constructor(
    private _dbService: DBService,
    private _createGameService: CreateGameService,
    private _storageService: LocalStorageService,
    private _router: Router
  ) { }

  public addUserToFireBase(idRoom: number) {
    let userid =  this._createGameService.getGeneratedRandomId().toString()
    this._storageService.setSesionStorageValue('userid',userid)

    let newUser: TUser = {
      name: this._getUserNameFromLocalStorage(),
      score: 20,
      id: +userid,
      isActive: false,
      result: "lose"
    };
    let currentUser: TUser;

    this._dbService.getObjectFromFireBase(`rooms/${idRoom}`)
      .take(1)
      .map(data => data.users)
      .switchMap(user => {
        return Observable.fromPromise(this._dbService.getObjectFromFireBase(`rooms/${idRoom}`).update({ users: [user[0], newUser], state: true }) as Promise<void>);
      })
      .subscribe((data) => {
        this._router.navigate(['playzone', idRoom])
      });
  }

  private _getUserNameFromLocalStorage(): string {
    let localData = this._storageService.getLocalStorageValue("user");
    return localData ? JSON.parse(localData).username : 'Unknown';
  }

}

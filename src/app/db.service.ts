import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';


@Injectable()
export class DBService {

  constructor(private _af : AngularFire) {}

  public getRoomByIdFromFB(id:number):FirebaseObjectObservable<any> {
    return this._af.database.object(`rooms/${id}`)
  }

  public updateStateOnFireBase(id: number, cards:TCard[][], activeCards:TCard[],  users: TUser[], countHiddenBlock){
    return this._af.database.object(`rooms/${id}`).update({cards: cards, activeCards: activeCards, users: users, countHiddenBlock: countHiddenBlock });
  }

}


import { Injectable } from '@angular/core';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

@Injectable()
export class FirebaseService {

  constructor(private _af : AngularFire) {}

  public subscribeToCurrentOpenedCell(id:number):FirebaseObjectObservable<any> {
    return this._af.database.object(`rooms/${id}/currentOpened`);
  }


  public updateStateOnFireBase(id: number, array:TCard[][], currentOpenedWords:TCard[],  users: TUser[], countHiddenBlock){
    return this._af.database.object(`rooms/${id}`).update({cards: array, currentOpened: currentOpenedWords, users: users, countHiddenBlock: countHiddenBlock });
  }

  public updateUsers(idRoom: number, users: TUser[]){
    return this._af.database.object(`rooms/${idRoom}`).update({users: users});
  }
   public updateStateRoom(idRoom: number, state: boolean) {
       return this._af.database.object(`rooms/${idRoom}`).update({state: state});
   }

   public getRoomByIdFromFB(id:number):FirebaseObjectObservable<any> {     //use at cards.component.ts (ngOnInit)
    return this._af.database.object(`rooms/${id}`)
  }

  public setUserState(id:number, username: string):FirebaseObjectObservable<any> {
    return this._af.database.object(`rooms/${id}/users/${username}`);
  }

  public getAllMultiPlayer(): FirebaseListObservable<any> {
    const queryObservable = this._af.database.list(`rooms`, {
        query: {
        orderByChild: "type",
        equalTo: "multi"
      }
    });
    return queryObservable;
  }

  public getObjectFromFirebase(str:string): FirebaseObjectObservable<any>  {
    return this._af.database.object(str);
  }

  public deleteRoom(id){
    this._af.database.object(`rooms/${id}`).remove();
    return this._af.database.object(`rooms/${id}`).remove();

  }
}

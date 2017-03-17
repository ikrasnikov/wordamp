
import { Injectable } from '@angular/core';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

@Injectable()
export class FirebaseService {

  constructor(private _af : AngularFire) {}


   public getRoomByIdFromFB(id:number):FirebaseObjectObservable<any> {     //use at cards.component.ts (ngOnInit)
    return this._af.database.object(`rooms/${id}`)
  }

}

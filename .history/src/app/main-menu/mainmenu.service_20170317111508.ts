import { Injectable, EventEmitter } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2';
import { SIZE } from '../constants';
import { FirebaseService } from "../firebase.service";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class MainmenuService {

  public isHideIntro: EventEmitter<boolean>;


  constructor(private _firebase: FirebaseService) {
    this.isHideIntro = new EventEmitter();
  }


  // work with localStorage

  public getLocalStorageValue(name: string): string {
    return (localStorage as Storage).getItem(name);
  }

}


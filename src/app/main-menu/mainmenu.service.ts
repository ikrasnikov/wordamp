import { Injectable, EventEmitter } from '@angular/core';
import { SIZE } from '../constants';

@Injectable()
export class MainmenuService {

  public isHideIntroForUser: EventEmitter<boolean>;


  constructor() {
    this.isHideIntroForUser = new EventEmitter();
  }


  // work with localStorage

  public getLocalStorageValue(name: string): string {
    return (localStorage as Storage).getItem(name);
  }

}


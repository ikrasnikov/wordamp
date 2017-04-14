import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  // work with localStorage
  public setLocalStorageValue(name: string, value: string):void {
    (localStorage as Storage).setItem(name, value);
  }

  public getLocalStorageValue(name: string): string {
    return (localStorage as Storage).getItem(name);
  }

  // work with sessionStorage
  public setSesionStorageValue(name: string, value: string):void {
    (sessionStorage as Storage).setItem(name, value);
  }

  public getSesionStorageValue(name: string): string {
    return (sessionStorage as Storage).getItem(name);
  }

}

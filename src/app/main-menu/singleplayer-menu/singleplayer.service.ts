import { Injectable } from '@angular/core';
import { MainmenuService } from '../mainmenu.service';

@Injectable()
export class SingleplayerService {

  constructor(private _menuService:MainmenuService) { }

   public setUserNameAtLocalStorage(name :string):void {
      let currentName = this._menuService.getLocalStorageValue("username");

      if (currentName) {
        if (name !== currentName)
        {
          this._menuService.removeLocalStorageValue("username");
          this._menuService.setLocalStorageValue("username", name);
        }
      }
      else {
          this._menuService.removeLocalStorageValue("username");
          this._menuService.setLocalStorageValue("username", name);
      }
   }

}


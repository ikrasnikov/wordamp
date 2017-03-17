import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SingleplayerService } from "./singleplayer.service";
import { MainmenuService } from "../mainmenu.service";

@Component({
  selector: 'app-singleplayer-menu',
  templateUrl: './singleplayer-menu.component.html',
  styleUrls: ['./singleplayer-menu.component.css']
})
export class SingleplayerMenuComponent {

  public menuGame: FormGroup;

  constructor(private _build: FormBuilder,
              private  _singleService: SingleplayerService,
              private _menuService: MainmenuService) {
                
    let name: string =  this._menuService.getLocalStorageValue("username");

    //reactive form for user
    this.menuGame = this._build.group({
      username: new FormControl(name),
      type: new FormControl('single'),
      languages: new FormControl('en_ru'),
      difficulty: new FormControl('small')
    });
    this._menuService.isHideIntroForUser.emit(false);

    this._menuService.getUsernameFromFormSubscriber = this.menuGame.valueChanges.subscribe(() => {
       this._singleService.setUserNameAtLocalStorage(this.menuGame.value.username);
    })
  }


  public onSubmit(event: Event): void{
    this._menuService.getUsernameFromFormSubscriber.unsubscribe();
    this._menuService.setLocalStorageValue("userid", "0");
    this._menuService.makePlayZone(this.menuGame.value);
    event.preventDefault();
  }

}

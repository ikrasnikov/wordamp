import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SingleplayerService } from "./singleplayer.service";
import { CreateGameService } from "../create-game.service";
import { LocalStorageService } from "../../local-storage.service";

@Component({
  selector: 'app-singleplayer-menu',
  templateUrl: './singleplayer-menu.component.html',
  styleUrls: ['./singleplayer-menu.component.css']
})
export class SingleplayerMenuComponent {

  public menuGame: FormGroup;

  constructor(private _build: FormBuilder,
              private  _singleService: SingleplayerService,
              private _localSrorage: LocalStorageService,
              private _createGameService: CreateGameService) {
                
    let name: string =  this._localSrorage.getLocalStorageValue("username");

    //reactive form for user
    this.menuGame = this._build.group({
      username: new FormControl(name),
      type: new FormControl('single'),
      languages: new FormControl('en_ru'),
      difficulty: new FormControl('small')
    });
    this._createGameService.isHideIntroForUser.emit(false);

  }


  public onSubmit(event: Event): void{
    this._localSrorage.setLocalStorageValue("userid", "0");
    this._singleService.setUserNameAtLocalStorage(this.menuGame.value.username);

    this._createGameService.makePlayZone(this.menuGame.value);
    event.preventDefault();
  }

}

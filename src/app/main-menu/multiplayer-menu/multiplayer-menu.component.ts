import {Component, OnDestroy} from '@angular/core';
import { MultiplayerService } from "./multiplayer.service";
import { LocalStorageService } from "../../local-storage.service";
import { Subscription } from "rxjs";
import { JoinGameService } from "../join-game.service";
import { DBService } from '../../db.service';
import { CreateGameService } from "../create-game.service";
import { Router} from '@angular/router';
import {OptionsService} from "../../options/options.service";

@Component({
  selector: 'app-multiplayer-menu',
  templateUrl: './multiplayer-menu.component.html',
  styleUrls: ['./multiplayer-menu.component.css']
})
export class MultiplayerMenuComponent implements OnDestroy {

  public rooms;
  public seekingUserName:string;
  private _subscribtion: Subscription;
  private _createGameSubscriber: Subscription;
  private _imageOfLanguages: any[] = [];

  constructor(private _multiService: MultiplayerService,
              private _joingameService: JoinGameService,
              private _storageService: LocalStorageService,
              private _createGameService: CreateGameService,
              private _router: Router,
              private _dbService: DBService,
              private _optionsService: OptionsService
  ) {


    this._createGameSubscriber = this._optionsService.createMultiGame
      .subscribe(() => this.startMultiGame());
    this._imageOfLanguages = this._joingameService.imageOfLanguages;
    this._updateRooms();
  }


  ngOnDestroy(){
    this._createGameSubscriber.unsubscribe();
  }

  public showOptions(){
    this._optionsService.showOptions.emit('multi');
  }


  private _updateRooms() {

    this.rooms = this._dbService.getAllMultiPlayerRoomFromFireBase()
      .map(data => {
        return data
          .filter(item=>item.users.length < 2)
          .map(item => {
            return {id: item.$key, player: item.users[0].name, difficulty: this._multiService.setDifficultyInGame(item.difficulty), language: this._multiService.setSrcForImageLanguage(this._imageOfLanguages,item.languages)};
          })
      });
  }

  public joinGame(idRoom: number):void {

    this._joingameService.addUserToFireBase(idRoom);
  }

  public findRoomByUserName() {
    if (this.seekingUserName !== "") {
      let arr = this.rooms.filter((item)=> {
        let regex = new RegExp(`${this.seekingUserName}`, 'ig');
        if(regex.test(item.player)) return item;
      });
      this.rooms = arr;
    } else {
      this._updateRooms();
    }
  }

  public startMultiGame(): void {
    this._storageService.setSesionStorageValue('useid', this._createGameService.getGeneratedRandomId().toString());
    let options = JSON.parse(this._storageService.getLocalStorageValue("user"));
    options.type ="multi";
    this._createGameService.makePlayZone(options);
  }


  public goToMainMenu(): void {
    this._router.navigate(['mainmenu']);
  }

}

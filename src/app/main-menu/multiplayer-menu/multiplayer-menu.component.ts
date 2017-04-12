import {Component, OnDestroy} from '@angular/core';
import { MultiplayerService } from "./multiplayer.service";
import { LocalStorageService } from "../../local-storage.service";
import { Subscription } from "rxjs";
import { JoinGameService } from "../join-game.service";
import { DBService } from '../../db.service';
import { CreateGameService } from "../create-game.service";
import { Router} from '@angular/router';
//import {OptionsService} from "../../options/options.service";

@Component({
  selector: 'app-multiplayer-menu',
  templateUrl: './multiplayer-menu.component.html',
  styleUrls: ['./multiplayer-menu.component.css']
})
export class MultiplayerMenuComponent implements OnDestroy {

  public rooms: TOutputData[] =[];
  private subscribe: Subscription;
  private _createGameSubscriber: Subscription;
  private imageOfLanguages: any[] = [];

  constructor(private _multiService: MultiplayerService,
              private _joingameService: JoinGameService,
              private _localSrorage: LocalStorageService,
              private _createGameService: CreateGameService,
              private _router: Router,
              private _dbService: DBService,
              //private _optionsService: OptionsService
              ) {

  // this._createGameSubscriber = this._optionsService.createMultiGame.
  //   subscribe(() => this.startMultiGame());
   this.imageOfLanguages = this._joingameService.imageOfLanguages;
   this._updateRooms();
  }


  ngOnDestroy(){
    //this._createGameSubscriber.unsubscribe();
     this.subscribe.unsubscribe();
  }


  public showOptions(){
    console.log("show option => start");
   // this._optionsService.showOptions.emit('multi');
  }


  private _updateRooms() {
    this.subscribe = this._dbService.getAllMultiPlayerRoom().subscribe(data => {
      this.rooms  =
        data.filter(item => {
                if (item.users.length < 2 && !this._multiService.isItemExistsInCurrentArray(item, this.rooms))  return item;
            })
            .map(item => {
                return {id: item.$key, player: item.users[0].name, difficulty: this._multiService.setDifficultyInGame(item.difficulty), language: this._multiService.setSrcForImageLanguage(this.imageOfLanguages,item.languages)};
            });
      });
  }

  public joinGame(idRoom: number):void {
    this.subscribe.unsubscribe();
    sessionStorage['userid'] = this._createGameService.getGeneratedRandomId().toString();
    //this._joingameService.addUserToFireBase(idRoom);
    console.log("join to game");
  }

  public findRoomByUserName(e) {
    let inputValue = e.target.value;
    if (inputValue !== "") {
      let arr = this.rooms.filter((item)=> {
        let regex = new RegExp(`${inputValue}`, 'ig');
        if(regex.test(item.player)) return item;
      });
      this.rooms = arr;
    } else {
      this._updateRooms();
    }
  }

  public startMultiGame(): void {
     this.subscribe.unsubscribe();
    sessionStorage['userid'] = this._createGameService.getGeneratedRandomId().toString();
    let options = JSON.parse(this._localSrorage.getLocalStorageValue("user"));
    options.type ="multi";
    this._createGameService.makePlayZone(options);
  }


  public goToMainMenu(): void {
    this._router.navigate(['mainmenu']);
  }

}

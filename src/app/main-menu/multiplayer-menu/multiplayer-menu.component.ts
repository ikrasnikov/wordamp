import { Component, OnInit } from '@angular/core';
import { MultiplayerService } from "./multiplayer.service";
import { LocalStorageService } from "../../local-storage.service";
import { Subscription } from "rxjs";
import { JoinGameService } from "../join-game.service";
import { DBService } from '../../db.service';


@Component({
  selector: 'app-multiplayer-menu',
  templateUrl: './multiplayer-menu.component.html',
  styleUrls: ['./multiplayer-menu.component.css']
})
export class MultiplayerMenuComponent implements OnInit {

  public rooms: TOutputData[] =[];
  private subscribe: Subscription;

  constructor(private _multiService: MultiplayerService,
              private _joingameService: JoinGameService,
              private _localSrorage: LocalStorageService,
              private _dbService: DBService) {

   this.subscribe = this._dbService.getAllMultiPlayerRoom().subscribe(data => {
      this.rooms  =
        data.filter(item => {
                if (item.users.length < 2 && !this._multiService.isItemExistsInCurrentArray(item, this.rooms))  return item;
            })
            .map(item => {
                return {id: item.$key, player: item.users[0].name, difficulty: this._multiService.setDifficultyInGame(item.difficulty), language: item.languages};
            });
   });

  }

  ngOnInit() {}

  public startGame(idRoom: number):void {
    this._joingameService.getValueFromFormSubscribe.unsubscribe();
    this.subscribe.unsubscribe();
    this._joingameService.addUserToFireBase(idRoom);
    this._localSrorage.setLocalStorageValue("userid", "1");
  }

}

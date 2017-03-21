import { Injectable } from '@angular/core';
import { CreateGameService } from "./create-game.service";
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { LocalStorageService } from "../local-storage.service";
import { Subscription } from "rxjs";

@Injectable()
export class JoinGameService {
   public getValueFromFormSubscribe;

   constructor(private _af : AngularFire,
              private _createGameService: CreateGameService,
              private _localSrorage: LocalStorageService) {}

  public addUserToFireBase(idRoom: number): void {

    let newUser: TUser = {name: this._getUserNameFromLocalStorage(), score: 20, id: 1, isActive: false, result: "lose"};

    let currentUser: TUser;

    let roomSubscribe: Subscription = this._af.database.object(`rooms/${idRoom}`).subscribe((data) => {
            currentUser = data.users[0];
            roomSubscribe.unsubscribe();

           this._af.database.object(`rooms/${idRoom}`).update({users: [currentUser, newUser], state: true})
            .then(() => this._createGameService.startPlayingGame.next(idRoom));
      });
  }

  private _getUserNameFromLocalStorage(): string {
    return this._localSrorage.getLocalStorageValue("username") || "Anonimous";
  }


 public doIfShareableLinkIsActivated(roomId: number): void {
   console.log("share", roomId);

    let shareLink: Subscription = this._af.database.object(`rooms/${roomId}`).subscribe(data => {
      if (data.users.length === 1) {
        shareLink.unsubscribe();
        this._localSrorage.setLocalStorageValue("userid", "1");
        this.addUserToFireBase(roomId);
      }
    });
  }

}

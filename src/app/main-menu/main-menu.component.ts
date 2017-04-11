import { Component } from '@angular/core';
import { CreateGameService } from "./create-game.service";
import { LocalStorageService } from "../local-storage.service";
import { Router} from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {
  public isOpenVideoIntro:boolean;

  constructor(private _createGameService: CreateGameService,
              private _router: Router,
              private _localSrorage: LocalStorageService) {
    if (!this._redirectToIntroPage()) {
      this._router.navigate(['/']);
    }
  }

  private _redirectToIntroPage(): boolean {
    return !!this._localSrorage.getLocalStorageValue("user");
  }

  public startSingleGame(event: Event): void {
    (event.target as HTMLElement).setAttribute("disabled", "true");
    let options = JSON.parse(this._localSrorage.getLocalStorageValue("user"));
    options.type = "single";
    sessionStorage['userid'] = this._createGameService.getGeneratedRandomId().toString();
    this._createGameService.makePlayZone(options);
    console.log("start single");
  }

  public goToMultiComponent(event: Event): void {
    (event.target as HTMLElement).setAttribute("disabled", "true");
    this._router.navigate(['mainmenu/multi']);
    console.log("go to multi");
  }

}
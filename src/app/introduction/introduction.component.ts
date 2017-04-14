import { Component } from '@angular/core';
import { CreateGameService } from "../main-menu/create-game.service";
import { LocalStorageService } from "../local-storage.service";
import { Router} from '@angular/router';

import { IntroductionService } from './introduction.service';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent {

  public isOpenVideoIntro:boolean;
  public userName :string;
  public isLoading: boolean;
  public toggleIntroInner = "Show introduction↓";

  constructor(private _createGameService: CreateGameService,
              private _storageService: LocalStorageService,
              private _introService: IntroductionService,
              private _router: Router) {
    this.isLoading = true;
    let timeDuration: number = Math.random() * 3;
    setTimeout(()=> {
      this.isLoading = false;
    }, timeDuration*1000);

    this.isOpenVideoIntro = false;
    this.updateUserName();
    this._introService.isShowMainPageForUser();
  }

  public showVideo(): void {
    this.isOpenVideoIntro = !this.isOpenVideoIntro;
    this.toggleIntroInner = (this.isOpenVideoIntro)? "Hide introduction↑": "Show introduction↓";
    this._introService.animate(
      {duration: 1000,
        timing: function(timeFraction) {
          return timeFraction;
        },
        draw: function(progress) {
          window.scrollTo(0, 0 + (progress * 350));
        }
      });
  }

  public allotAllText(e:Event): void {
    (e.target as HTMLInputElement).select();
  }

  public startSingleGameDefault(): void {
    this._introService.getDefaultOptions(this.userName)
      .subscribe(data => {
        this._storageService.setLocalStorageValue("user", JSON.stringify(data));
        this._storageService.setSesionStorageValue('userid', this._createGameService.getGeneratedRandomId().toString());
        this._createGameService.makePlayZone(data);
      });
  }

  public goToMainMenu(): void {
    this._introService.getDefaultOptions(this.userName)
      .subscribe(data => {
        this._storageService.setLocalStorageValue("user", JSON.stringify(data));
        this._router.navigate(['mainmenu']);
      });
  }

  public updateUserName(): void {
    this.userName = this._introService.setDefaultName();
  }
}

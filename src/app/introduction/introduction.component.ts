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
              private _localStorage: LocalStorageService,
              private _introService: IntroductionService,
              private _router: Router) {
    this.isLoading = true;
    let timeDuration: number = Math.random() * 3;
    setTimeout(()=> {
        this.isLoading = false;
    }, timeDuration*1000);
               
    this.isOpenVideoIntro = false;
    this.userName = this._introService.setDefaultName();
    this._introService.isShowMainPageForUser();
  }

  public showVideo(event:Event): void {
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
    this._introService.setDefaultOptions(this.userName);
    let sub = this._introService.getLangEmit.subscribe(data => {
       this._localStorage.setLocalStorageValue("user", JSON.stringify(data));
       sessionStorage['userid'] = this._createGameService.getGeneratedRandomId().toString();
       data.type ="single";
       this._createGameService.makePlayZone(data);
    });

  }

  private _sendUserTo(router: string): void {
    this._introService.setDefaultOptions(this.userName);
    this._introService.getLangEmit.subscribe(data => {
      this._localStorage.setLocalStorageValue("user", JSON.stringify(data));
      this._router.navigate([router]);
    });
  }

  public goToMainMenu(): void {
    this._sendUserTo('mainmenu');
  }

  public updateName(): void {
    this.userName = this._introService.setDefaultName();
  }
}

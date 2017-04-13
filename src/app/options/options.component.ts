import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { LocalStorageService } from "../local-storage.service";
import { JoinGameService } from "../main-menu/join-game.service";
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import {OptionsService} from "./options.service";

@Component({
  selector: 'app-options-menu',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent implements OnDestroy {

  private menuGame: FormGroup;
  private defaultOptions: any;
  private _showSubscriber: Subscription;
  private _gameType: string;
  public keyDownHandler: any;

  public isEditing:boolean = false;
  public isShow:boolean = false;

  public currentImageLanguage: EventTarget;
  public currentLanguages: TLanguages = {
    first: {
      src: "",
      name: ""
    },
    last: {
      src: "",
      name: ""
    }
  };
  public imageOfLanguages: TItemLang[];
  public getChangesFromForm: Subscription;

  constructor(private _build: FormBuilder,
              private _localSrorage: LocalStorageService,
              private _joinService: JoinGameService,
              private _optionsService: OptionsService) {

    this.keyDownHandler = this._endingOfSettingsByKeyEvent.bind(this);

    this._showSubscriber = this._optionsService.showOptions
      .subscribe(gameType =>  {
        this.isShow = true;
        this._gameType = gameType;

        document.addEventListener("keydown", this.keyDownHandler);
        this.imageOfLanguages = this._joinService.imageOfLanguages;
        this.defaultOptions = JSON.parse(this._localSrorage.getLocalStorageValue('user'));
        this._updateFormGroup();
        this._setLanguagePicture();

        this.getChangesFromForm = this.menuGame.valueChanges.subscribe((value) => {
          this._localSrorage.setLocalStorageValue("user", JSON.stringify(this.menuGame.value));
        });
      });
  }

  ngOnDestroy() {
    document.removeEventListener("keydown", this.keyDownHandler);
    this._showSubscriber.unsubscribe();
    this.getChangesFromForm.unsubscribe();
  }


  private _updateFormGroup(): void {
    //reactive form for user
    this.menuGame = this._build.group({
      username: new FormControl(this.defaultOptions.username),
      languages: new FormGroup({
        first: new FormControl(this.defaultOptions.languages.first),
        last: new FormControl(this.defaultOptions.languages.last)
      }),
      difficulty: new FormControl(this.defaultOptions.difficulty)
    });
  }


  private _endingOfSettingsByKeyEvent(event: Event): void {
    let code = (event as KeyboardEvent).keyCode;
    if (code === 13 || code === 27) {
      event.preventDefault();
      document.removeEventListener("keydown", this.keyDownHandler);
      code === 13 ? this.startGame(event) : this.closePopup();
    }
  }


  public startGame(event){
    (event.target as HTMLElement).setAttribute("disabled", "true");
    document.removeEventListener("keydown", this.keyDownHandler);
    this.getChangesFromForm.unsubscribe();
    this.isShow = false;
    this._gameType === 'multi' ? this._optionsService.createMultiGame.emit(this.menuGame.value) : this._optionsService.createSingleGame.emit(this.menuGame.value);
    event.preventDefault();
}


  public closePopup(){
    document.removeEventListener("keydown", this.keyDownHandler);
    this.isShow = false;
    this.getChangesFromForm.unsubscribe();
  }

  public toogleStateOfEditing(): void {
    this.isEditing = !this.isEditing;
  }
  public resetStateOfEditing(event): void {
    this.isEditing = false;
    event.stopPropagation();
  }

  public allotAllText(e :Event): void {
    (e.target as HTMLInputElement).select();
  }

  public saveNameOfLangByClickOnItem(e :Event) : void {
    let name: string = (e.target as HTMLElement).getAttribute("name");
    ((e.target as HTMLElement).getAttribute("data-order") === "first")? this.menuGame.value.languages.first = name: this.menuGame.value.languages.last = name;
     this._localSrorage.setLocalStorageValue("user", JSON.stringify(this.menuGame.value));
}

  private _setLanguagePicture(): void {
  this.imageOfLanguages.forEach(image => {
     if (this.menuGame.value.languages.first === image.name)
       this.currentLanguages.first = image;
     if (this.menuGame.value.languages.last === image.name)
       this.currentLanguages.last = image;
   });
 }

  public setNewLanguageImage(e: Event): void {
    //spacially for FireFox
    // if ((e.target as HTMLElement).tagName === "BUTTON") {
    //   this.currentImageLanguage = (e.target as HTMLElement).firstElementChild;
    //   return;
    // }
    this.currentImageLanguage = e.target;
  }

}

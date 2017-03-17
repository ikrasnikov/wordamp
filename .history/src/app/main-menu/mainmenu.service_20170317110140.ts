import { Injectable, EventEmitter } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2';
import { SIZE } from '../constants';
import { FirebaseService } from "../firebase.service";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class MainmenuService {

  public createRoomOnFirebase: FirebaseObjectObservable<any>;
  public firstLanguage:string[];
  public lastLanguage:string[];

  public startPlayingGame:EventEmitter<number>;
  public sendToMultiplater: EventEmitter<number>;
  public isHideIntro: EventEmitter<boolean>;
  public getValueFromFormSubscribe;


  constructor(private _firebase: FirebaseService) {
    this.startPlayingGame = new EventEmitter();
    this.sendToMultiplater = new EventEmitter();
    this.isHideIntro = new EventEmitter();
    this.createRoomOnFirebase = this._firebase.getObjectFromFirebase("rooms");
  }


   public makePlayZone({ languages, difficulty, username, type }): void {
    let score = 20;
    let size: {w: number, h:number} = SIZE[difficulty];
    let [lang1, lang2] = languages.split('_');
    let cards: TCard[][] = [];
    let idRoom: number = this._generateIdRoom();

    this._firebase.getObjectFromFirebase(`/dictionary/${lang1}`)
      .map(res => {
        this.firstLanguage = res;
      })
      .switchMap( event =>  this._firebase.getObjectFromFirebase(`/dictionary/${lang2}`))
      .map(res => {
        this.lastLanguage = res;
      })
      .subscribe(() => {
        let newRoom: any = {};

        cards = this._createCards( size.w, size.h );
        newRoom[idRoom] = { cards: cards ,type:type, state: true, difficulty: difficulty, languages: languages, users: [{name: username, score: score, id: 0, isActive: true, activity: true, result: 'lose'}], countHiddenBlock: 0 };

        this.createRoomOnFirebase.update(newRoom)          //send data to FireBase
          .then( () => {
            return (type === "single") ? this.startPlayingGame.emit(idRoom) : this.sendToMultiplater.emit(idRoom);
             //send roomId to single.components.ts
          });
      });
  }


  private  _createCards(col: number, row: number): TCard[][] {
    let arr: TCard[] = [];
    let wordIdList: number[] = this._getWordIdList(row * col);

    for (let i: number = 0; i < row * col; i++) {
      let square: TCard = {
        id: i,
        wordId: Math.ceil((i + 1) / 2),
        isOpen: false,
        isHide: false,
        word: this._getWordFromLanguage(i, wordIdList[Math.floor(i / 2)])
      };
      arr.push(square);
    }
    arr.sort(this._sortRandom);
    return this._createMatrix(arr, row, col);
  }

  private _createMatrix(array: TCard[], row: number, col: number): TCard[][] {
    let matrix: TCard[][]= [];
    let count: number = 0;

    for (let i: number = 0; i < row; i++) {
      matrix[i] = [];
      for (let j:number = 0; j < col; j++) {
        matrix[i][j] = array[count];
        count++;
      }
    }
    return matrix;
  }

  private _sortRandom():number {
    return Math.random() - 0.5;
  }

  private _getWordIdList(size: number): number[] {                       //get different and single Ids from dictionary
    let wordsId:number[] = [];                         //array of different Id

    for (let i: number = 0; i < size / 2; i++){
      let temp: number = Math.round(Math.random() * size / 2 + 1);

      (wordsId.indexOf(temp) == -1)?  wordsId.push(temp) :  i--;
    }
    return wordsId;
  }

  private _getWordFromLanguage(item:number, wordId:number):string {
    return (item % 2 === 0)?  this.firstLanguage[wordId] :  this.lastLanguage[wordId];
  }

  private _generateIdRoom():number {
    return new Date().getTime();
  }

  // work with localStorage

  public setLocalStorageValue(name: string, value: string):void {
    (localStorage as Storage).setItem(name, value);
  }

  public getLocalStorageValue(name: string): string {
    return (localStorage as Storage).getItem(name);
  }

  public removeLocalStorageValue(name: string) {
    (localStorage as Storage).removeItem(name);
  }

}


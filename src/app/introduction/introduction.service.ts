import { Injectable, EventEmitter } from '@angular/core';
import { LocalStorageService } from "../local-storage.service";
import { DBService } from "../db.service";
import { Router} from '@angular/router';
import { Subscription } from "rxjs";

@Injectable()
export class IntroductionService {
    private _defaltNickNames:string[] = [
    "Donald Duc", "Crazy Cow", "Batman",
    "Кэп", "Harry Potter", "Jolly Rodger",
    "Scrooge McDuck", "Orange", "Lord Braine",
    "Dr. Hurt", 'Spanky','Animal','Hambone',
    'Lumpy','Spum','T- Money','Toastmaster',
    'Buzzy','Wheezy','Quarter','Jimmy Seepage',
    'White Stuff','Burning Ooz','Bagel','Poindexter',
    'Breezy','Imposter Drew','Butters','Pack O’ Smokes',
    'Vixen','Muffin Man','Nitro','MilkMan','Joel the Hole',
    'Memory Jones','Drunk Jason','Lefty','Yaworm',
    'Big Stinky Pete','Saudi','Jewman','Hat Chris',
    'The AssMan','Kokomo','Bondo','Girth','The Dirty Mexican',
    'Russhole','Coop','Noah','Dirty Bird','ShoeShine',
    'Stoffer','Daytrader','Digger','Sparky',
    'Obi-Wan','Silent Chris','Boarder Chris',
    'Scoot McGoot','Sambo','FM','Tangy','Big daddy','Bon-bon',
    'Hero','Bumblebee','Chico','Champ','Cherubic',
    'Cutie wootie','Dawg','Dreamboat','Honey bunch',
    'Hot chocolate','Boo-boo','Dumpling','Egghead',
    'Rock star','Tarzan','Tiger','Tiger toes',
    'Hottie','Huggy bear','HunkJumbo','Lamsie pamsie',
    'Little soldier','Chocoboy','Chunkie wunkie','Monkey buns',
    'Mr. Bones','Mr. Foo-Foo','Casanova','Loveboy','Lover boy',
    'Picklehead','Shnookums','Smoochy','Snuggles','Pooh bear',
    'Tyrone','Uncle Tom','Velcro Head','Jigga','Jiggaboo',
    'Jigroid','Jungle bunny','Kaffir','Mud Puppy','Mud Shark',
    'Negro','Negroid','Porker','Lard a','Cottage cheese thighs',
    'Blimp','Butter ball','Fat-a-potamis','Trouser destroyer',
    'fat','pig or swine','physically challenged','big butt',
    'balloon','gas filled','God zilla'];
    
   public getLangEmit:EventEmitter<any>;
    

  constructor(private _router: Router,
              private _localSrorage: LocalStorageService,
               private _dbService: DBService) {
                 this.getLangEmit = new EventEmitter();
               }

  public animate(options): void {
    let start:number = performance.now();
    requestAnimationFrame(function _animate(time) {
        let timeFraction: number = (time - start) / options.duration;
        if (timeFraction > 1) timeFraction = 1;
        let progress = options.timing(timeFraction);
        options.draw(progress);
        if (timeFraction < 1) {
            requestAnimationFrame(_animate);
        }else {
            options.cb && options.cb();
        }
    });
  }

  public setDefaultName():string {
      let rand:number = Math.round(Math.random() * (this._defaltNickNames.length - 1));    
      return this._defaltNickNames[rand];
  }

  public isShowMainPageForUser():void {
    if (this._localSrorage.getLocalStorageValue("user")) {
      this._router.navigate(['mainmenu']);
    }
  }

   public setDefaultOptions(username: string): void {
    let options: TInputData = {
      username: username,
      difficulty: "small",
      languages : {
        first: "",
        last: ""
      },
      type: ""
    };

    let dictionaryListObservable: Subscription = this._dbService.getObjectFromFB(`dictionary/languagaesList`).subscribe(lang => {

      options.languages.first = this._getLanguage("first",lang);
      options.languages.last = this._getLanguage("last",lang);
      this.getLangEmit.emit(options);
      dictionaryListObservable.unsubscribe();
    });

  }

  private _getLanguage(type: string, languagesList: string[]): string {
    let firstLang = navigator.language.slice(0, 2);
    let browserLanguages = (type === "first") ?  [firstLang] : this._getDifferentLangFromTheMain(firstLang);
    return this._findExistLanguages(languagesList,browserLanguages );
  }

  private _findExistLanguages(languagesList: string[], currentLanguages:string[]): string{
    let name: string = "en";
    currentLanguages.forEach (currentLanguages => {
      languagesList.forEach(languageName => {
        if (currentLanguages === languageName) name = languageName;
      });
    });
    return name;
  }

  private _getDifferentLangFromTheMain(first: string): string[] {
    let secondLanguage: string = "en";
    if(navigator['languages']){
      let diffLang:string[] = navigator['languages']
        .map(item => {
          return item.slice(0, 2);
        })
        .filter(item => {
          return item !== first;
        });
      if (!diffLang.length) diffLang = ["en"];
      return diffLang;
    }else {
      return ["en"];
    }
  }

}
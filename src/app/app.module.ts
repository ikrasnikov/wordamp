import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './firebase.config';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { MainMenuComponent } from './main-menu/main-menu.component';
import { CreateGameService } from "./main-menu/create-game.service";

import { SingleplayerMenuComponent } from './main-menu/singleplayer-menu/singleplayer-menu.component';
import { SingleplayerService } from "./main-menu/singleplayer-menu/singleplayer.service";

import { MultiplayerMenuComponent } from  './main-menu/multiplayer-menu/multiplayer-menu.component';
import { MultiplayerService } from "./main-menu/multiplayer-menu/multiplayer.service";

import { LocalStorageService } from "./local-storage.service";
import { JoinGameService } from "./main-menu/join-game.service"

import { AppComponent } from './app.component';

const routes = [
   {
    path: "mainmenu", component: MainMenuComponent,
    children: [
      {
        path: 'single', component: SingleplayerMenuComponent
      },
      {
        path: 'multi', component: MultiplayerMenuComponent
      }]
  },
  {
    path: "mainmenu/multi/:id", component: MainMenuComponent
  },
  {
    path: '',
    redirectTo: '/mainmenu',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    MultiplayerMenuComponent,
    SingleplayerMenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(routes),
  ],
  providers: [CreateGameService, SingleplayerService, LocalStorageService, MultiplayerService, JoinGameService],
  bootstrap: [AppComponent],
})
export class AppModule { }

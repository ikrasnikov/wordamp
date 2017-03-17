import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './firebase.config';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


import { SingleplayerMenuComponent } from './main-menu/singleplayer-menu/singleplayer-menu.component';
import { MultiplayerMenuComponent } from  './main-menu/multiplayer-menu/multiplayer-menu.component';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';

import { MainmenuService } from "./main-menu/mainmenu.service";

import { AppRoutingModule, routingComponents } from './app.routing';



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
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [MainmenuService],
  bootstrap: [AppComponent],
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './firebase.config';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { MainMenuComponent } from './main-menu/main-menu.component';
import { MainmenuService } from "./main-menu/mainmenu.service";

import { SingleplayerMenuComponent } from './main-menu/singleplayer-menu/singleplayer-menu.component';
import { SingleplayerService } from "./main-menu/singleplayer-menu/singleplayer.service";

import { MultiplayerMenuComponent } from  './main-menu/multiplayer-menu/multiplayer-menu.component';
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
  providers: [MainmenuService, SingleplayerService],
  bootstrap: [AppComponent],
})
export class AppModule { }

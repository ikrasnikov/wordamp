import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './firebase.config';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { SingleplayerMenuComponent } from './main-menu/singleplayer-menu/singleplayer-menu.component';
import { PlayzoneComponent } from './playzone/playzone.component';
import { SidebarComponent } from './playzone/sidebar/sidebar.component';
import { GameFieldComponent } from './playzone/game-field/game-field.component';
import { ResultComponent } from './result/result.component';



const routes = [

];


@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    SingleplayerMenuComponent,
    PlayzoneComponent,
    SidebarComponent,
    GameFieldComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

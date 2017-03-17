import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleplayerMenuComponent } from './main-menu/singleplayer-menu/singleplayer-menu.component';
import { MultiplayerMenuComponent } from  './main-menu/multiplayer-menu/multiplayer-menu.component';
import { MainMenuComponent } from './main-menu/main-menu.component';

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
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule],
 })
 export class AppRoutingModule { }

 export const routingComponents = [MainMenuComponent, SingleplayerMenuComponent, MultiplayerMenuComponent];

/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';
import { WelcomeComponent } from './welcome/welcome.component';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'c2m-app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss'
  ],
  template: `
    <main>
      <c2m-welcome></c2m-welcome>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {

  private runtime = require('serviceworker-webpack-plugin/lib/runtime');

  constructor(public appState: AppState) {
    if ('serviceWorker' in navigator) {
      runtime.register();
    }
  }
}

/*
  <nav>
      <a [routerLink]=" ['./'] "
        routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
        Index
      </a>
      <a [routerLink]=" ['./home'] "
        routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
        Home
      </a>
      <a [routerLink]=" ['./detail'] "
        routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
        Detail
      </a>
      <a [routerLink]=" ['./barrel'] "
        routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
        Barrel
      </a>
      <a [routerLink]=" ['./about'] "
        routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
        About
      </a>
    </nav>

 */

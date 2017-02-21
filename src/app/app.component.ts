/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';
import { WelcomeComponent } from './welcome/welcome.component';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import { SignInService } from './services/sign-in/sign-in.service';

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
    <router-outlet></router-outlet>
  `
})
export class AppComponent {

  private runtime = require('serviceworker-webpack-plugin/lib/runtime');

  constructor(
    public appState: AppState,
    private signInService: SignInService
  ) {
    this.signInService.observeSignInState();

    if ('serviceWorker' in navigator) {
      runtime.register();
    }
  }
}

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AppState } from './app.service';
import { WelcomeComponent } from './welcome/welcome.component';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import { SignInService } from './services/sign-in/sign-in.service';

@Component({
  selector: 'c2m-app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss'],
  template: `
    <router-outlet></router-outlet>
    <div id="toast"></div>
  `
})
export class AppComponent implements OnInit {

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

  public ngOnInit() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        navigator.serviceWorker.addEventListener('message', event => {

          switch (event.data) {
            case 'sw_initial':
              this.displaySnackbar('Caching complete! App now works offline.');
              break;

            case 'sw_new_version':
              this.displaySnackbar('New Version is available.');
              break;

            default:
              console.log('message command does not exist');
          }
        });
      });
    }
  }

  public displaySnackbar(textContent: string): void {
    let snackbarEl = document.getElementById('toast');
    snackbarEl.className = 'show';
    snackbarEl.textContent = textContent;

    setTimeout(() => {
      snackbarEl.className = snackbarEl.className.replace('show', '');
    }, 3000);
  }
}

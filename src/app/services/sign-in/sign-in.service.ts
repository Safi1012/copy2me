import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DatabaseService } from '../database/database.service';
import * as firebase from 'firebase';

@Injectable()
export class SignInService {

  public isDemoAccount = false;

  constructor(
    private databaseService: DatabaseService,
    private router: Router
  ) { }

  // sign-in

  public signAnonymously() {
    firebase.auth().signInAnonymously().then(() => {
      this.isDemoAccount = true;
    }).catch(err => {
      console.log('signInAnonymously: ' + err);
    });
  }

  public signInWithService(service: SignInProvider) {
    let provider;

    switch (service) {
      case SignInProvider.Google:
        provider = new firebase.auth.GoogleAuthProvider();
        break;

      case SignInProvider.Github:
        provider = new firebase.auth.GithubAuthProvider();
        break;

      case SignInProvider.Twitter:
        provider = new firebase.auth.TwitterAuthProvider();
        break;

      default:
        console.log('selected service does not exist');
    }
    this.signInWithProvider(provider);
  }

  // sign-out

  public signOut() {
    firebase.auth().signOut().then(() => {
      this.isDemoAccount = false;
      console.log('sign-out successfully');

    }, err => {
      console.log('sign-out error: ' + err);

    });
  }

  // observe sign-in state

  public observeSignInState() {
    firebase.auth().onAuthStateChanged((user: firebase.User) => {
      if (user) {
        user.getToken().then(token => {
          this.databaseService.addUser(user.uid, token);
          this.router.navigate(['/home']);
        });

      } else {
        this.databaseService.wipeAllDatabases();
        this.router.navigate(['/welcome']);

      }
    });
  }

  public isUserSignedIn(): Promise<boolean> {
    return new Promise(resolve => {
      this.databaseService.getUser().then(user => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      }).catch(err => {
        console.log(err);
        resolve(false);
      });
    });
  }

  private signInWithProvider(provider: any) {
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult()
      .then(success => {
        console.log('sign-in success');
      })
      .catch(err => {
        // this.router.navigate(['/welcome']);
      });
  }
}

export enum SignInProvider {
  Google,
  Github,
  Twitter,
  Demo
}

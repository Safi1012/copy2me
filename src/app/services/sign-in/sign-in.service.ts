import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DatabaseService } from '../database/database.service';
import * as firebase from 'firebase';

export enum SignInProvider {
  Google,
  Github,
  Twitter,
  Demo
}

@Injectable()
export class SignInService {

  constructor(
    private databaseService: DatabaseService,
    private router: Router,
  ) { }

  public signAnonymously() {
    firebase.auth().signInAnonymously().catch(err => {
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

    this.signInWithProvider(provider).catch(err => {
      console.log('signInWithProvider: ' + err);
    });
  }

  public observeSignInState() {
    firebase.auth().onAuthStateChanged((user: firebase.User) => {
      if (user) {
        user.getToken().then(token => {
          this.databaseService.addUser(user.uid, token);
          this.router.navigate(['/home']);
        });

      } else {
        this.databaseService.wipeUserData();
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
      })
    });
  }

  public signOut() {
    firebase.auth().signOut().then(() => {
      console.log('sign-out successfully');

    }, err => {
      console.log('sign-out error: ' + err);

    });
  }

  private signInWithProvider(provider: any): Promise<boolean> {
    firebase.auth().signInWithRedirect(provider);
    return new Promise((resolve, reject) => {

      firebase.auth().getRedirectResult().then(result => {
        resolve();

      }).catch((error: any) => {
        reject();

      });
    });
  }
}

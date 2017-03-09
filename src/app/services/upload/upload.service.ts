import * as firebase from 'firebase';

import { Injectable } from '@angular/core';
import { HistoryService } from '../history/history.service';
import { DatabaseService } from '../database/database.service';
import { User } from '../../models/user.model';

@Injectable()
export class UploadService {

  constructor(
    private databaseService: DatabaseService,
    private historyService: HistoryService
  ) { }

  public pushLinkToFirebase(text: string) {
    this.databaseService.getUser().then(user => {

      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
          .then(() => {
            this.pushLinkToFirebaseWithRestAPI(text, user);
          }).catch((err) => {
            console.log('Service worker is not ready: ' + err);
          });

      } else {
        // serviceworker/sync not supported
        this.pushLinkToFirebaseWithWebAPI(text, user);
      }

    });
  }

  private pushLinkToFirebaseWithRestAPI(text: string, user: User) {
    let timestamp = new Date().getTime();

    // optimistic update
    this.databaseService.addLinkToHistoryDB(timestamp * -1, text, true).then(() => {
      // forces history.component -> to refetch all links from IndexedDB
      this.historyService.observer.next();

      this.databaseService.addUploadTextMessageToQueue(timestamp, text, user).then(() => {
        return navigator.serviceWorker.ready;

      }).then(sw => {
        sw.sync.register('outbox');

      });
    });
  }

  private pushLinkToFirebaseWithWebAPI(text: string, user: User) {
    firebase.database().ref('links/' + user.uid + '/history')
      .push({
        text,
        'timestamp': new Date().getTime() * -1, // milliseconds, * -1 enables firebase sorting,
        'push-auth': user.push.auth,
        'notification-sent': false
      })
      .catch(error => {
        console.log('error: ' + error);
      });
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import * as firebase from 'firebase';

import { DatabaseService } from '../database/database.service';
import { User } from '../../models/user.model';
import { HistoryEntry } from '../../models/history-entry.model';

const CHUNK_SIZE = 30;

@Injectable()
export class HistoryService {

  public isInitial = true;

  constructor(
    private databaseService: DatabaseService
  ) { }

  public fetchLinksFromFirebase(startTimestamp: number, user: User): Observable<[any]> {

    return new Observable<[any]>(observer => {

      let historyRef = firebase.database().ref('links/' + user.uid + '/history')
        .orderByChild('timestamp').startAt(startTimestamp).limitToFirst(CHUNK_SIZE);

      historyRef.on('child_added', data => {
        this.databaseService.addLinkToHistoryDB(data.val().timestamp, data.val().text);
        observer.next();
      });

      historyRef.on('child_removed', data => {
        this.databaseService.removeLinkFromHistoryDB(data.val().timestamp);
        observer.next();
      });

      historyRef.on('child_changed', data => {
        this.databaseService.editLinkInHistoryDB(data.val().timestamp, data.val().text);
        observer.next();
      });

    }).debounceTime(25);
  }

  public clearHistory() {
    this.databaseService.getUser().then(user => {
      firebase.database().ref('links/' + user.uid).child('/history').remove();
      this.databaseService.clearHistoryDB();
    });
  }
}

  // fetchTextFromFirebase(startTimestamp: number, user: User): Observable<[any]> {
  //   return new Observable<[any]>(observer => {
  //     let historyRef = firebase.database().ref('links/' + user.uid + '/history').
  //       orderByChild('timestamp').startAt(startTimestamp).limitToFirst(this.CHUNK_SIZE);

  //     historyRef.on('child_added', result => {
  //       let historyEntry = new HistoryEntry(result.val().timestamp * -1, result.val().text);

  //       this.databaseService.addTextToDbHistory(historyEntry.timestamp as number, historyEntry.text);
  //       observer.next(historyEntry);
  //     });
  //   }
  //   ).scan((acc, value) => {
  //     acc.push(value);
  //     return acc;
  //   }, []);
  // }

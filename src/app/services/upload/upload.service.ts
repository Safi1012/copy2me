import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import * as firebase from 'firebase';

@Injectable()
export class UploadService {

  constructor(
    private databaseService: DatabaseService
  ) { }

  public pushLinkToFirebase(text: string) {
    this.databaseService.getUser()
      .then(user => {

        firebase.database().ref('links/' + user.uid + '/history')
          .push({
            text,
            timestamp: new Date().getTime() * -1 // milliseconds, * -1 enables firebase sorting
          })
          .catch(error => {
            console.log('error: ' + error);
          });
      });
  }
}

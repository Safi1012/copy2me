import * as localForage from 'localforage';

import { User } from '../../models/user.model';
import { Push } from '../../models/push.model';
import { Message } from '../../models/message.models';
import { HistoryEntry } from '../../models/history-entry.model';

export class DatabaseService {

  private historyDB = localForage.createInstance({ name: 'copy2me_history' });
  private historyIntialDB = localForage.createInstance({ name: 'copy2me_history_initial' });
  private userDB = localForage.createInstance({ name: 'copy2me_user' });
  private messageDB = localForage.createInstance({ name: 'copy2me_messsages' });
  private user: User;
  private userHistory = [];

  // user management

  public addUser(uid: string, token: string) {
    let push = new Push('', '', '');
    let user = new User(uid, token, push);

    this.userDB.setItem('user', user).catch(err => {
      console.log('Localforage - error saving user: ' + err);
    });
  }

  public getUser(): Promise<User> {
    return new Promise((resolve, reject) => {

      this.userDB.getItem('user').then(user => {
        resolve(user);

      }).catch(err => {
        console.log('Localforage - error loading user: ' + err);
        reject();

      });
    });
  }

  public setUserSubscriptionData(push: Push) {
    this.getUser().then(user => {
      let updatedUser = new User(user.uid, user.token, push);
      this.userDB.setItem('user', updatedUser).catch(err => {
        console.log('Localforage - error saving user: ' + err);
      });
    });
  }

  public getNewestTimestamp(isInitial: boolean): Promise<number> {
    let history = [];

    return new Promise((resolve) => {

      if (!isInitial) {
        this.historyDB.iterate((value, key, iterationNumber) => {
          history.push(value);

        }).then(() => {
          if (history.length === 0) {
            resolve(-9999999999999); // force small timestamp
          } else {
            history.sort(this.compareTimestamp);
            resolve((history[history.length - 1].timestamp * -1) + 1);
          }

        }).catch(err => {
          console.log('Localforage - error loading history' + err);

        });
      } else {
        resolve(-9999999999999); // force small timestamp
      }
    });
  }

  public getInformationForFetchEvent(isInitial: boolean): Promise<[User, number]> {
    let userPromise = this.getUser();
    let newestTimestampPromise = this.getNewestTimestamp(isInitial);

    return Promise.all([userPromise, newestTimestampPromise]);
  }

  // Clear database

  public wipeAllDatabases() {
    this.clearUserDB();
    this.clearHistoryDB();
    this.clearInitialHistoryDB();
    this.clearMessageDB();
  }

  public clearUserDB() {
    return this.userDB.clear();
  }

  public clearHistoryDB(): Promise<void> {
    return this.historyDB.clear();
  }

  public clearInitialHistoryDB(): Promise<void> {
    return this.historyIntialDB.clear();
  }

  public clearMessageDB(): Promise<void> {
    return this.messageDB.clear();
  }

  public overrideOldHistoryDB() {

    return this.historyDB.clear().then(() => {
      let promises = [];

      return this.historyIntialDB.iterate((value, key, iterationNumber) => {
        let historyEntry = value as HistoryEntry;
        promises.push(this.historyDB.setItem(key, historyEntry));

      }).then(() => {
        return Promise.all(promises);

      });
    });
  }

  // offline history data

  public getLinksFromHistoryDB(): Promise<[any]> {
    let history = [];
    return new Promise((resolve) => {

      this.historyDB.iterate((value, key, iterationNumber) => {
        history.push(value);

      }).then(() => {
        history.sort(this.compareTimestamp);
        resolve(history);

      }).catch(err => {
        console.log('Localforage - error loading history' + err);
        resolve([]);

      });
    });
  }

  public addLinkToHistoryDB(timestamp: number, text: string): Promise<[void | HistoryEntry, void | HistoryEntry]> {
    // make timestamp positive -> only work with positive timestamps on the client side
    let historyEntry = new HistoryEntry(timestamp * -1, text);

    let historyDbPromise = this.historyDB.setItem(String(timestamp * -1), historyEntry).catch(err => {
      console.log('Localforage - error saving history entry' + err);
    });

    let historyIntitialDbPromise = this.historyIntialDB.setItem(String(timestamp * -1), historyEntry).catch(err => {
      console.log('Localforage - error saving history entry' + err);
    });

    return Promise.all([historyDbPromise, historyIntitialDbPromise]);
  }

  public removeLinkFromHistoryDB(timestamp: number) {
    return this.historyDB.removeItem(String(timestamp * -1)).catch(err => {
      console.log('Localforage - error removing entry from historyDB' + err);
    }).then(() => {
      console.log('removed item');
    });
  }

  public editLinkInHistoryDB(timestamp: number, text: string) {
    let historyEntry = new HistoryEntry(timestamp * -1, text);

    return this.historyDB.getItem(String(timestamp * -1))
      .then(item => {
        item = historyEntry;
        this.historyDB.setItem(String(timestamp * -1), item).catch(err => {
          console.log('Localforage - error editing history entry' + err);
        });
      })
      .catch(err => {
        console.log('Localforage - error editing history entry' + err);
      });
  }

  // message queue for sw

  public addUploadTextMessageToQueue(timestamp: number, text: string, user: User): Promise<Message> {
    let message = new Message(String(timestamp), user, text);

    return this.messageDB.setItem(String(timestamp), message).catch(err => {
      console.log('Localforage - error saving message' + err);
    });
  }

  public removeMessageQueue() {
    this.messageDB.clear().catch(err => {
      console.log('Localforage - error clearing messages db' + err);
    });
  }

  private compareTimestamp(a, b) {
    if (a.timestamp > b.timestamp) {
      return -1;
    }
    if (a.timestamp < b.timestamp) {
      return 1;
    }
    return 0;
  }

}

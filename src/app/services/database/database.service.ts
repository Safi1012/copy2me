import { User } from '../../models/user.model';
import * as localForage from 'localforage';
import { HistoryEntry } from '../../models/history-entry.model';

export class DatabaseService {

  private historyDB = localForage.createInstance({ name: 'copy2me_history' });
  private historyIntialDB = localForage.createInstance({ name: 'copy2me_history_initial' });
  private userDB = localForage.createInstance({ name: 'copy2me_user' });
  private user: User;
  private userHistory = [];

  // user management

  public addUser(uid: string, token: string) {
    let user = new User(uid, token);

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
            // history.sort(this.compareTimestamp);
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
  }

  public clearUserDB() {
    this.userDB.clear().catch(err => {
      console.log('Localforage - error clearing user db' + err);
    });
  }

  public clearHistoryDB(): Promise<void> {
    return this.historyDB.clear();
  }

  public clearInitialHistoryDB(): Promise<void> {
    return this.historyIntialDB.clear();
  }

  public overrideOldHistoryDB(): Promise<void> {
    return this.clearHistoryDB().then(() => {
      this.historyDB = this.historyIntialDB;
    });





    // console.log('historyDB');
    // this.historyDB.iterate((link, timestamp, iterationNumber) => {
    //   console.log(link + timestamp + iterationNumber);
    // }).then(() => {


    //   console.log('historyIntitialDB');
    //   this.historyIntialDB.iterate((link, timestamp, iterationNumber) => {
    //     console.log(link + timestamp + iterationNumber);
    //   }).then(() => {
    //     this.historyDB = this.historyIntialDB;


    //     this.historyDB.iterate((link, timestamp, iterationNumber) => {
    //       console.log(link + timestamp + iterationNumber + 'historyDB');
    //     }).then(() => {
    //       console.log('historyDB');

    //     });


    //   });











    // this.clearHistoryDB().then(() => {

    //   return Promise.all([
    //     this.historyIntialDB.iterate((link, timestamp, iterationNumber) => {
    //       let historyEntry = new HistoryEntry(Number(timestamp), link);

    //       return this.historyDB.setItem(timestamp, historyEntry);
    //     })
    //   ]);
    // });

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

  public addLinkToHistoryDB(timestamp: number, text: string): Promise<HistoryEntry[]> {
    let historyEntry = new HistoryEntry(timestamp * -1, text);

    let historyDbPromise = this.historyDB.setItem(String(timestamp * -1), historyEntry).catch(err => {
      console.log('Localforage - error saving history entry' + err);
    });

    let historyIntitialDbPromise = this.historyIntialDB.setItem(String(timestamp * -1), historyEntry).catch(err => {
      console.log('Localforage - error saving history entry' + err);
    });

    return Promise.all([historyDbPromise, historyIntitialDbPromise]);


    // return this.historyDB.setItem(String(timestamp * -1), historyEntry).catch(err => {
    //   console.log('Localforage - error saving history entry' + err);
    // });
  }

  public removeLinkFromHistoryDB(timestamp: number) {
    return this.historyDB.removeItem(String(timestamp * -1)).catch(err => {
      console.log('Localforage - error removing entry from historyDB' + err);
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


  //   addToLocalHistory(timestamp: number, text: string) {
  //     this.userHistory.push(new HistoryEntry(timestamp * -1, text));
  //     this.userHistory.sort(this.compareTimestamp);
  //   }









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

  // public fetchHistoryFromCache(): Promise<[any]> {
  //   return this.getUserHistory().then(history => {
  //     this.userHistory = history;
  //     return history;
  //   });
  // }

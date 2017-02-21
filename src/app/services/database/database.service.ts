import { User } from '../../models/user.model';
import * as localForage from 'localforage';

export class DatabaseService {

  private lfHistory = localForage.createInstance({ name: 'copy2me_history' });
  private lfUser = localForage.createInstance({ name: 'copy2me_user' });
  private user: User;
  private userHistory = [];

  // user management

  public addUser(uid: string, token: string) {
    let user = new User(uid, token);

    this.lfUser.setItem('user', user).catch(err => {
      console.log('Localforage - error saving user: ' + err);
    });
  }

  public getUser(): Promise<User> {
    return new Promise((resolve, reject) => {

      this.lfUser.getItem('user').then(user => {
        resolve(user);

      }).catch(err => {
        console.log('Localforage - error loading user: ' + err);
        reject();

      });
    });
  }

  // Clear database

  public wipeUserData() {
    this.removeUser();
    this.removeUserHistory();
  }

  public removeUser() {
    this.lfUser.clear().catch(err => {
      console.log('Localforage - error clearing user db' + err);
    });
  }

  public removeUserHistory() {
    this.lfHistory.clear().catch(err => {
      console.log('Localforage - error clearing history db' + err);
    });
  }




  //   // offline history data

  //   addToLocalHistory(timestamp: number, text: string) {
  //     this.userHistory.push(new HistoryEntry(timestamp * -1, text));
  //     this.userHistory.sort(this.compareTimestamp);
  //   }

  //   addTextToDbHistory(timestamp: number, text: string) {
  //     let historyEntry = new HistoryEntry(timestamp * -1, text);

  //     this.lfHistory.setItem(String(timestamp * -1), historyEntry).catch(err => {
  //       console.log('Localforage - error saving history entry' + err);
  //     });
  //   }

  //   getUserHistory(): Promise<[any]> {
  //     let history = [];

  //     return new Promise((resolve) => {

  //       this.lfHistory.iterate((value, key, iterationNumber) => {
  //         history.push(value);

  //       }).then(() => {
  //         history.sort(this.compareTimestamp);
  //         resolve(history);

  //       }).catch(err => {
  //         console.log('Localforage - error loading history' + err);
  //         resolve([]);

  //       });
  //     });
  //   }

  //   getInformationForFetchEvent(): Promise<[User, number]> {
  //     let userPromise = this.getUser();
  //     let newestTimestampPromise = this.getNewestTimestamp();

  //     return Promise.all([userPromise, newestTimestampPromise]);
  //   }

  //   getNewestTimestamp(): Promise<number> {
  //     let history = [];

  //     return new Promise((resolve) => {

  //       this.lfHistory.iterate((value, key, iterationNumber) => {
  //         history.push(value);

  //       }).then(() => {
  //         if (history.length === 0) {
  //           resolve(-9999999999999); // force small timestamp
  //         } else {
  //           history.sort(this.compareTimestamp);
  //           resolve((history[history.length - 1].timestamp * -1) + 1);
  //         }

  //       }).catch(err => {
  //         console.log('Localforage - error loading history' + err);

  //       });
  //     });
  //   }

  //   private compareTimestamp(a, b) {
  //     if (a.timestamp > b.timestamp)
  //       return -1;
  //     if (a.timestamp < b.timestamp)
  //       return 1;
  //     return 0;
  //   }

}

  // public fetchHistoryFromCache(): Promise<[any]> {
  //   return this.getUserHistory().then(history => {
  //     this.userHistory = history;
  //     return history;
  //   });
  // }
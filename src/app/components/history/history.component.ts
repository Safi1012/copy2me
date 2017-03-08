import { Component, ApplicationRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HistoryService } from '../../services/history/history.service';
import { DatabaseService } from '../../services/database/database.service';
import { PushService } from '../../services/push/push.service';
import { SignInService } from '../../services/sign-in/sign-in.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'c2m-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public links = [];

  public isPushSupported = this.pushService.isPushSupported();
  public isIOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) &&
    (window.navigator as any).standalone ? true : false);

  constructor(
    private historyService: HistoryService,
    private databaseService: DatabaseService,
    private appRef: ApplicationRef,
    public pushService: PushService,
    public signInService: SignInService
  ) { }

  public ngOnInit() {
    this.historyService.isInitial = true;
    this.databaseService.clearInitialHistoryDB().then(() => {

      this.fetchLinksFromDB();

      this.databaseService.getInformationForFetchEvent(true).then(values => {
        let user = values[0];
        let startTimestamp = values[1];

        this.fetchLinksFromFirebase(startTimestamp, user);
      });

    });
  }

  public fetchLinksFromDB() {
    this.databaseService.getLinksFromHistoryDB().then(links => {
      this.links = links;
      this.appRef.tick();
    });
  }

  public fetchLinksFromFirebase(startTimestamp: number, user: User) {

    this.historyService.fetchLinksFromFirebase(startTimestamp, user).subscribe(
      value => {
        if (this.historyService.isInitial) {
          this.historyService.isInitial = false;
          this.databaseService.overrideOldHistoryDB().then(() => {
            this.fetchLinksFromDB();
          });
        } else {
          this.fetchLinksFromDB();
        }
      },
      err => {
        console.log(err);
      },
      () => {
        console.log('completed');
      }
    );
  };

  public onScroll() {
    this.databaseService.getInformationForFetchEvent(this.historyService.isInitial).then(values => {
      let user = values[0];
      let startTimestamp = values[1];

      this.fetchLinksFromFirebase(startTimestamp, user);
    });
  }

  // copy to clipboard

  public displaySnackbar(textContent: string): void {
    let snackbarEl = document.getElementById('toast');
    snackbarEl.className = 'show';
    snackbarEl.textContent = textContent;

    setTimeout(() => {
      snackbarEl.className = snackbarEl.className.replace('show', '');
    }, 3000);
  }

  public copyToClipboardOnSuccess() {
    this.displaySnackbar('Copied to clipboard!');
  }
}

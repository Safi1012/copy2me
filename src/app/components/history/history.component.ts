import { Component, ApplicationRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HistoryService } from '../../services/history/history.service';
import { DatabaseService } from '../../services/database/database.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'c2m-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public links = [];

  public isIOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) &&
    (window.navigator as any).standalone ? true : false);

  constructor(
    private historyService: HistoryService,
    private databaseService: DatabaseService,
    private appRef: ApplicationRef
  ) { }

  public ngOnInit() {
    this.historyService.isInitial = true;
    this.databaseService.clearInitialHistoryDB().then(() => {

      this.fetchLinksFromDB();

      this.databaseService.getInformationForFetchEvent(true).then(values => {
        console.log(values);
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
    console.log('scroll');

    // outsource
    this.databaseService.getInformationForFetchEvent(this.historyService.isInitial).then(values => {
      console.log(values);
      console.log(this.historyService.isInitial);
      let user = values[0];
      let startTimestamp = values[1];

      this.fetchLinksFromFirebase(startTimestamp, user);
    });
  }



  // if (!this.isLoading) { // throttle
  //   this.isLoading = true;

  //   this.databaseService.getInformationForFetchEvent().then(values => {
  //     this.isLoading = false;
  //     let user = values[0];
  //     let startTimestamp = values[1];

  //     this.historyService.fetchTextFromFirebase(startTimestamp, user).subscribe(
  //       value => {
  //         this.links = value;
  //         this.appRef.tick();
  //       }
  //     );
  //   });
  // }





  // copy to clipboard

  public copyToClipboardOnSuccess() {
    // trigger toast
  }

  public copyToClipboardOnError() {
    // display error message
  }
}

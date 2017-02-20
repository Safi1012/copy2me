import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignInService } from '../sign-in/sign-in.service';
import { HistoryService } from '../history/history.service';

@Component({
  selector: 'c2m-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  public isDropdownOpen = false;
  public isIOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) &&
    (window.navigator as any).standalone ? true : false);

  constructor(
    private router: Router,
    // private signInService: SignInService,
    // private historyService: HistoryService,
  ) { }

  // signOut() {
  //   this.signInService.signOut();
  // }

  // clearHistory() {
  //   this.historyService.clearHistory();
  // }
}

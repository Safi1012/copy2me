import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignInService } from '../../services/sign-in/sign-in.service';
import { HistoryService } from '../../services/history/history.service';

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
    public router: Router,
    private signInService: SignInService,
    // private historyService: HistoryService,
  ) { }

  public signOut() {
    this.signInService.signOut();
  }

  public clearHistory() {
    // this.historyService.clearHistory();
  }
}

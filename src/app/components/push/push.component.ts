import { Component, OnInit } from '@angular/core';
import { PushService } from '../../services/push/push.service';

@Component({
  selector: 'c2m-push',
  templateUrl: 'push.component.html',
  styleUrls: ['./push.component.scss'],
})
export class PushComponent implements OnInit {

  public isIOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) &&
    (window.navigator as any).standalone ? true : false);

  constructor(
    public pushService: PushService
  ) { }

  public ngOnInit() {
    this.pushService.loadSubscriptionState();
  }

  public managePushSubscription() {
    if (this.pushService.isSubscribed) {
      this.pushService.unsubsribeFromPush();
    } else {
      this.pushService.subscribeToPush();
    }
  }
}

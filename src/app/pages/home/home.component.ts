import { Component } from '@angular/core';
import { PushService } from '../../services/push/push.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public isPushSupported = this.pushService.isPushSupported();

  constructor(
    public pushService: PushService
  ) {}

}

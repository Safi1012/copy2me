import { Component } from '@angular/core';
import { PushService } from '../../services/push/push.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [PushService]
})
export class HomeComponent {

  constructor(
    private pushService: PushService
  ) {

  }

}

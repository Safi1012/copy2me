import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'c2m-push',
  templateUrl: 'push.component.html',
  styleUrls: ['./push.component.scss']
})
export class PushComponent implements OnInit {

  public isIOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) &&
    (window.navigator as any).standalone ? true : false);

  constructor() { }

  ngOnInit() { }
}

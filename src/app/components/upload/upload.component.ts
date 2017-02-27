import { Component, ViewChild, ElementRef } from '@angular/core';
import { UploadService } from '../../services/upload/upload.service';
import { PushService } from '../../services/push/push.service';

@Component({
  selector: 'c2m-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [UploadService]
})
export class UploadComponent {
  @ViewChild('linkInput') public linkInput: ElementRef;

  public inputFieldText = '';
  public isIOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) &&
    (window.navigator as any).standalone ? true : false);

  constructor(
    private uploadService: UploadService,
    private pushService: PushService
  ) { }

  public uploadLinkText() {
    if (this.inputFieldText.length > 0) {
      this.uploadService.pushLinkToFirebase(this.inputFieldText);
      this.inputFieldText = '';
      (this.linkInput.nativeElement as HTMLInputElement).blur();
    }
  }
}

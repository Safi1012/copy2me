import { Component, ViewChild, ElementRef } from '@angular/core';
import { UploadService } from '../../services/upload/upload.service';

@Component({
  selector: 'c2m-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [UploadService]
})
export class UploadComponent {
  @ViewChild('linkInput') public linkInput: ElementRef;

  public isIOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) &&
    (window.navigator as any).standalone ? true : false);

  constructor(
    private uploadService: UploadService
  ) { }

  public uploadLinkText() {
    let input = (this.linkInput.nativeElement as HTMLInputElement);

    if (input.value.length > 0) {
      this.uploadService.pushLinkToFirebase(input.value);
      input.value = '';
      input.blur();
    }
  }
}

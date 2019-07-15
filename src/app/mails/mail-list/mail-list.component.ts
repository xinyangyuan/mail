import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MailService } from '../mail.service';
import { Mail } from '../mail.model';

@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.css']
})
export class MailListComponent implements OnInit, OnDestroy {
  // Attributes
  public mailList: Mail[];

  // Attributes: observers
  private mailsListObserver: Subscription;
  private mailCreateObserver: Subscription;
  private mailUpdateObserver: Subscription;
  private mailDeletionObserver: Subscription;

  constructor(private mailService: MailService) {}

  // Init Method
  async ngOnInit() {
    this.mailsListObserver = this.mailService
      ._getMailList()
      .subscribe(data => (this.mailList = data));
  }

  // Method: view mail content pdf
  onView(id: string) {
    const newWindow = window.open('', '_blank');
    newWindow.document.write('Loading pdf... <br> Please turn off AdBlock to see the pdf file.');

    this.mailService.getContentPDF(id).subscribe(pdf => {
      const file = new Blob([pdf], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);
      newWindow.location.href = fileURL;
    });
  }

  // Destroy Method
  ngOnDestroy() {
    // cancel service subscriptions on destory
    // this.mailsListObserver.unsubscribe();
    // this.mailCreateObserver.unsubscribe();
    // this.mailUpdateObserver.unsubscribe();
    // this.mailDeletionObserver.unsubscribe();
  }
}

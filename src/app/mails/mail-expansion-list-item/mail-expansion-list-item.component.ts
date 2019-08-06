import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngxs/store';
import { SafeUrl } from '@angular/platform-browser';

import { Mail } from '../mail.model';
import { MailState } from '../state/mail.state';
import * as MailActions from '../state/mail.action';

@Component({
  selector: 'app-mail-expansion-list-item',
  templateUrl: './mail-expansion-list-item.component.html',
  styleUrls: ['./mail-expansion-list-item.component.css']
})
export class MailExpansionListItemComponent implements OnChanges {
  // Attributes:
  @Input() mail: Mail;
  @Input() imageURL: SafeUrl;

  // Constructor:
  constructor(private store: Store) {}

  // Init Method:
  ngOnChanges() {}

  // Method: user clicked on expansion panel
  onExpand() {
    // snapshot of store
    const currentImageTasks = this.store.selectSnapshot(MailState.currentImageTasks);

    // dipatch action if image (1) is not fetched or (2) background worker is not fething it now
    if (typeof this.imageURL === 'undefined' && !currentImageTasks.includes(this.mail._id)) {
      this.store.dispatch(new MailActions.GetEnvelopImage(this.mail));
    }
  }

  // Method: user clicked star-button
  onStar(event: MouseEvent) {
    // disable mat-expansion panel from expanding
    event.stopPropagation();

    // dispacthc action
    this.store.dispatch(new MailActions.ToggleMailStarFlag(this.mail));
  }

  // Method: user clicked delete-button
  onDelete() {}

  // Method: user clicked view-button
  onView() {}

  // Method: view mail content pdf
  // async onView(mail: Mail) {
  //   // open new window and display loading message
  //   const pdfWindow = window.open('', '_blank');
  //   pdfWindow.document.write('Loading pdf... <br> Please turn off AdBlock to see the pdf file.');

  //   // get content pdf
  //   const file = await this.mailService.getContentPDF(mail._id).toPromise();
  //   const pdfURL = window.URL.createObjectURL(file);
  //   pdfWindow.location.href = pdfURL;

  //   // change read flag
  //   mail.flags.read = true;
  // }
}

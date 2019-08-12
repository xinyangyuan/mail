import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngxs/store';
import { SafeUrl } from '@angular/platform-browser';

import { Mail } from '../mail.model';
import { MailState } from '../store/mail.state';
import * as MailActions from '../store/mail.action';

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

  // Method:
  onExpand() {
    // snapshot of store currrentImageTasks
    const currentImageTasks = this.store.selectSnapshot(MailState.currentImageTasks);

    // dipatch action if image (1) is not fetched or (2) background worker is not fething it now
    if (typeof this.imageURL === 'undefined' && !currentImageTasks.includes(this.mail._id)) {
      this.store.dispatch(new MailActions.GetEnvelopImage(this.mail));
    }
  }

  // Method:
  onStar(event: MouseEvent) {
    // disable mat-expansion panel from expanding
    event.stopPropagation();

    // dispacthc action
    this.store.dispatch(new MailActions.ToggleMailStarFlag(this.mail));
  }

  // Method:
  onScan() {}

  // Method:
  onRejectScan() {}

  // Method:

  // Method:
  onDelete() {}

  // Method:
  onView() {
    // open new window and display loading message
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write('Loading pdf... <br> Please turn off AdBlock to see the pdf file.');

    // load pdf in window
    this.store.dispatch(new MailActions.GetContentPdf(this.mail)).subscribe(() => {
      const pdfURL = this.store.selectSnapshot(MailState.pdfURL);
      console.log(pdfURL);
      pdfWindow.location.href = pdfURL;
    });
  }
}

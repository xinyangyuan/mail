import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatCheckboxChange } from '@angular/material';
import { Store, Select, Actions, ofActionDispatched } from '@ngxs/store';
import { SafeUrl } from '@angular/platform-browser';

import { Mail } from '../mail.model';
import { MailState } from '../store/mail.state';
import * as MailActions from '../store/mail.action';

@Component({
  selector: 'app-mail-card-grid-item',
  templateUrl: './mail-card-grid-item.component.html',
  styleUrls: ['./mail-card-grid-item.component.css']
})
export class MailCardGridItemComponent implements OnInit, OnChanges {
  // Attributes:
  @Input() mail: Mail;
  @Input() imageURL: SafeUrl;

  // Checkbox & UI
  @Select(MailState.selectMode) isSelectMode$: Observable<boolean>;
  isSelected = false;
  showToolbar = false; // show toolbar on hover
  menuOpen = false;

  // Constructor:
  constructor(private store: Store, private actions$: Actions) {}

  // Init Method:
  ngOnInit() {
    // unselect all mails if user call other actions on a specific mail (e.g. star a mail)
    this.store.dispatch(MailActions.UnselectAllMails);

    // listen on unSelectAllMails action -> uncheck selected checkbox
    this.actions$
      .pipe(ofActionDispatched(MailActions.UnselectAllMails))
      .subscribe(() => (this.isSelected = false));

    // listen on selectAllMails action -> check selected checkbox
    this.actions$
      .pipe(ofActionDispatched(MailActions.SelectAllMails))
      .subscribe(() => (this.isSelected = true));
  }

  // Change Method:
  ngOnChanges() {}

  // Mehtod:
  onCheckbox(event: MatCheckboxChange) {
    if (event.checked) {
      this.store.dispatch(new MailActions.SelectMail(this.mail));
    } else if (!event.checked) {
      this.store.dispatch(new MailActions.UnselectMail(this.mail));
    }
  }

  // Method:
  onStar() {
    // dispacthc action: togller mail star
    this.store.dispatch(new MailActions.ToggleMailStarFlag(this.mail));
  }

  // Method:
  onView() {
    // open new window and display loading message
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write('Loading pdf... <br> Please turn off AdBlock to see the pdf file.');

    // load pdf in window
    this.store.dispatch(new MailActions.GetContentPdf(this.mail)).subscribe(() => {
      const pdfURL = this.store.selectSnapshot(MailState.pdfURL);
      pdfWindow.location.href = pdfURL;
    });
  }
}

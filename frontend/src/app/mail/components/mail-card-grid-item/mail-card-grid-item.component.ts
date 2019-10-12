import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatCheckboxChange } from '@angular/material';
import { Store, Select } from '@ngxs/store';
import { SafeUrl } from '@angular/platform-browser';

import { Mail } from '../../models/mail.model';
import { MailState } from '../../store/mail.state';
import * as MailActions from '../../store/mail.action';

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
  menuOpen = false;
  showToolbar = false; // show toolbar on hover
  isSelected$: Observable<boolean>;
  @Select(MailState.selectMode) isSelectMode$: Observable<boolean>;

  // Constructor:
  constructor(private store: Store) {}

  // Init Method:
  ngOnInit() {
    // this.mail property is undefined before initialization
    this.isSelected$ = this.store.select(MailState.isSelected(this.mail));
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

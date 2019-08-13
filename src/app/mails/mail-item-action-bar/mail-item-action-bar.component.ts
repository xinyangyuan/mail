import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { MailStatus, Mail } from '../mail.model';
import * as MailActions from '../store/mail.action';
import { AuthState } from 'src/app/auth/store/auth.state';

@Component({
  selector: 'app-mail-item-action-bar',
  templateUrl: './mail-item-action-bar.component.html',
  styleUrls: ['./mail-item-action-bar.component.css']
})
export class MailItemActionBarComponent implements OnInit {
  // Attributes:
  isSender: boolean;
  @Input() mail: Mail;

  // UI Button Diplay:
  scan = false;
  pullbackScan = false;
  skipScan = false;
  uploadPdf = false;
  edit = false;
  delete = false;

  // Constructor:
  constructor(private store: Store, private router: Router) {}

  // Init Method:
  ngOnInit() {
    this.isSender = this.store.selectSnapshot(AuthState.isSender);
    this.generateView();
  }

  // Method:
  onScan() {
    // dispacthc action: scan mail
    this.store.dispatch(new MailActions.ScanMail(this.mail));
  }

  // Method:
  onSkipScan() {
    // dispacthc action: skip scan mail
    this.store.dispatch(new MailActions.UnscanMail(this.mail));
  }

  // Method:
  onEdit() {
    // dispacthc action: edit a mail
    this.store.dispatch(new MailActions.EditMail(this.mail)).subscribe(() => {
      this.router.navigate(['/edit']);
    });
  }

  // Method:
  onUploadScan() {
    // dispacthc action: upload scan
    this.store.dispatch(new MailActions.EditMail(this.mail)).subscribe(() => {
      this.router.navigate(['/uploadPdf']);
    });
  }

  // Method:
  onDelete() {}

  // Method:
  generateView() {
    if (this.isSender) {
      switch (this.mail.status) {
        case MailStatus.CREATED: {
          this.edit = true;
          this.delete = true;
          break;
        }
        case MailStatus.SCANNING: {
          this.uploadPdf = true;
        }
      }
    } else {
      switch (this.mail.status) {
        case MailStatus.CREATED: {
          this.scan = true;
          this.skipScan = true;
          break;
        }
        case MailStatus.SCAN_REJECTED: {
          this.pullbackScan = true;
        }
      }
    }
  }
}

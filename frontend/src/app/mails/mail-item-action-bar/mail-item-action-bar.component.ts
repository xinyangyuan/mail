import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { MailStatus, Mail } from '../mail.model';
import * as MailActions from '../store/mail.action';
import { AuthState } from 'src/app/auth/store/auth.state';
import { MatSnackBar } from '@angular/material';

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
  constructor(private store: Store, private router: Router, private snackbar: MatSnackBar) {}

  // Init Method:
  ngOnInit() {
    this.isSender = this.store.selectSnapshot(AuthState.isSender);
    this.generateView();
  }

  // Method:
  onScan() {
    // dispatch action: scan mail
    this.store.dispatch(new MailActions.ScanMail(this.mail)).subscribe(() => {
      this.snackbar.open('Mail Added to Scanning 🏃', 'CLOSE', {
        panelClass: ['info-snackbar']
      });
    });
  }

  // Method:
  onSkipScan() {
    // dispatch action: skip scan mail
    this.store.dispatch(new MailActions.UnscanMail(this.mail)).subscribe(() => {
      this.snackbar.open('Mail is Archived', 'CLOSE', {
        panelClass: ['info-snackbar']
      });
    });
  }

  // Method:
  onEdit() {
    // dispatch action: edit a mail
    this.store.dispatch(new MailActions.EditMail(this.mail)).subscribe(() => {
      this.router.navigate(['/edit']);
    });
  }

  // Method:
  onUploadScan() {
    // dispatch action: upload scan
    this.store.dispatch(new MailActions.EditMail(this.mail)).subscribe(() => {
      this.router.navigate(['/upload-pdf']);
    });
  }

  // Method:
  onDelete() {
    // dispatch action: delete mail
    this.store.dispatch(new MailActions.DeleteMail(this.mail)).subscribe(() => {
      this.snackbar.open('Mail is Deleted', 'CLOSE', { panelClass: ['warning-snackbar'] });
    });
  }

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

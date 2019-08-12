import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import { AuthService } from '../../auth/auth.service';
import { MailState } from 'src/app/mails/store/mail.state';
import * as MailActions from 'src/app/mails/store/mail.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // Attributes:
  isSender: boolean;
  @Select(MailState.selectMode) isSelectMode$: Observable<boolean>;
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router, private store: Store) {}

  ngOnInit() {
    this.isSender = this.authService.getSenderStatus();
  }

  // Method: toggle side navigation
  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  // Method: sign out
  onSignOut() {
    this.authService.signOut();
    this.router.navigate(['']);
  }

  // Method: select all mails in view
  onSelectAll() {
    this.store.dispatch(new MailActions.SelectAllMails());
  }

  // Method: un-select all in view
  onUnSelectAll() {
    this.store.dispatch(new MailActions.UnselectAllMails());
  }

  // Method: scan all selected mails
  onScanAll() {
    this.store.dispatch(
      new MailActions.ScanMails(this.store.selectSnapshot(MailState.selectedMails))
    );
  }

  // Method: skip scan all selected mails
  onSkipScanAll() {
    this.store.dispatch(
      new MailActions.UnscanMails(this.store.selectSnapshot(MailState.selectedMails))
    );
  }

  // Method: sttared all selected mails
  onStarredAll() {
    this.store.dispatch(
      new MailActions.StarredMails(this.store.selectSnapshot(MailState.selectedMails))
    );
  }

  // Method: un-sttared all selected mails
  onUnstarredAll() {
    this.store.dispatch(
      new MailActions.UnstarredMails(this.store.selectSnapshot(MailState.selectedMails))
    );
  }
}

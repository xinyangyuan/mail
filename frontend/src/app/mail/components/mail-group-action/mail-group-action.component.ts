import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';

import { MailState } from '../../store/mail.state';
import * as MailActions from '../../store/mail.action';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mail-group-action',
  templateUrl: './mail-group-action.component.html',
  styleUrls: ['./mail-group-action.component.css']
})
export class MailGroupActionComponent implements OnInit {
  // Attributes:
  @Select(state => state.account.user.role) userRole$: Observable<'USER' | 'SENDER'>;

  // Constructor:
  constructor(private store: Store) {}

  // Init method:
  ngOnInit() {}

  // Method: unselect all mails
  onCancel() {
    this.store.dispatch(new MailActions.UnselectAllMails());
  }

  // Method: star selected mails
  onStar() {
    this.store.dispatch(
      new MailActions.StarredMails(this.store.selectSnapshot(MailState.selectedMails))
    );
  }

  // Method: scan selected mails
  onScan() {
    this.store.dispatch(
      new MailActions.ScanMails(this.store.selectSnapshot(MailState.selectedMails))
    );
  }

  // Method: reject scan selected mails
  onRejectScan() {
    this.store.dispatch(
      new MailActions.UnscanMails(this.store.selectSnapshot(MailState.selectedMails))
    );
  }
}

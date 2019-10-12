import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import * as MailActions from '../../store/mail.action';

@Component({
  selector: 'app-mail-edit-page',
  templateUrl: './mail-edit-page.component.html',
  styleUrls: ['./mail-edit-page.component.css']
})
export class MailEditPageComponent implements OnInit {
  // Constructor:
  constructor(private store: Store, private router: Router) {}

  // Init Method:
  ngOnInit() {}

  // Method:
  onCancel() {
    this.store
      .dispatch(new MailActions.UneditMail())
      .subscribe(() => this.router.navigate(['/mails']));
  }
}

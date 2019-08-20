import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';

import * as PasswordlessActions from '../store/passwordless.action';

@Component({
  selector: 'app-passwordless-mail-update',
  templateUrl: './passwordless-mail-update.component.html',
  styleUrls: ['./passwordless-mail-update.component.css']
})
export class PasswordlessMailUpdateComponent implements OnInit {
  // Attributes
  id: string;
  emailToken: string;
  updatedStatus: 'scan' | 'skip-scan';
  timer: NodeJS.Timer;
  text = 'loading result';

  // Constructor:
  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.emailToken = this.route.snapshot.params.emailToken;
    this.updatedStatus = this.route.snapshot.fragment as 'scan' | 'skip-scan';

    if (document.visibilityState === 'visible') {
      this.timer = setTimeout(() => this.updateMail(), 3000);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimeout(this.timer);
      } else {
        this.timer = setTimeout(() => this.updateMail(), 5000);
      }
    });
  }

  updateMail() {
    this.store
      .dispatch(
        new PasswordlessActions.UpdateMailStatus({ id: this.id, emailToken: this.emailToken })
      )
      .subscribe(() => {
        switch (this.updatedStatus) {
          case 'scan':
            this.text = 'Mail is Scanning Now 🏃';
            break;
          case 'skip-scan':
            this.text = 'Mail is Archived!';
            break;
          default:
            this.text = 'Mail is Processed!';
        }
      });
  }
}

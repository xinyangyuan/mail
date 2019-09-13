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
  timer: NodeJS.Timer;

  // update result:
  updatedStatus: 'scan' | 'skip-scan';
  result: string;
  isSucceeded: boolean;

  // ui
  isloading: boolean = true;

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
      .subscribe(
        () => {
          this.isloading = false;
          this.isSucceeded = true;
          switch (this.updatedStatus) {
            case 'scan':
              this.result = 'Mail is Scanning Now. 🏃';
              break;
            case 'skip-scan':
              this.result = 'Mail is Archived.';
              break;
            default:
              this.result = 'Mail is Processed.';
          }
        },
        () => {
          this.isloading = false;
          this.isSucceeded = false;
          this.result = 'Unable to Update.';
        }
      );
  }
}

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

import * as AuthActions from '../../auth/store/auth.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-new',
  templateUrl: './header-new.component.html',
  styleUrls: ['./header-new.component.css']
})
export class HeaderNewComponent implements OnInit {
  // Constructor:
  constructor(private store: Store, private router: Router) {}

  // Init Method:
  ngOnInit() {}

  // Method: sign out
  onSignOut() {
    this.store.dispatch(new AuthActions.SignOut()).subscribe(() => {
      this.router.navigate(['']);
    });
  }
}

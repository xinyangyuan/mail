import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import * as AuthActions from './auth/store/auth.action';
// import * as AccountActions from './account/store/account.acion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  // Constructor:
  constructor(private store: Store, private router: Router) {}

  // OnInit:
  async ngOnInit() {
    // this.store.dispatch(new AuthActions.AutoSignIn()).subscribe(() => {
    //   this.router.navigate(['/mails']);
    // });
  }

  ngAfterViewInit() {}
}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import * as AuthActions from './auth/store/auth.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  // Constructor:
  constructor(private store: Store, private router: Router) {}

  // OnInit:
  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoSignIn());
  }

  ngAfterViewInit() {}
}

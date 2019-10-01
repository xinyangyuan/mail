import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import * as AuthActions from './auth/store/auth.action';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Constructor:
  constructor(private store: Store, private router: Router) {}

  // OnInit:
  ngOnInit() {
    console.log(environment);
    this.store.dispatch(new AuthActions.AutoSignIn());
  }
}

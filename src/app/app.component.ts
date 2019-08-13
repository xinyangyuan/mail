import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import * as AuthAction from './auth/store/auth.action';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Constructor:
  constructor(private store: Store, private router: Router, private authService: AuthService) {}

  // OnInit:
  ngOnInit() {
    this.store.dispatch(new AuthAction.AutoSignIn());

    if (this.authService.autoSignIn()) {
      this.router.navigate(['mails']);
    }
  }
}

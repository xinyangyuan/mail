import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import * as figlet from 'figlet';
import subzero from 'figlet/importable-fonts/Sub-Zero.js';

import * as AuthActions from './auth/store/auth.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Constructor:
  constructor(private store: Store, private router: Router) {}

  // OnInit:
  async ngOnInit() {
    // auto-log in:
    this.store.dispatch(new AuthActions.AutoSignIn());

    // eastern egg for developer:
    this.logSlogan();
  }

  // Method: developer console log
  logSlogan() {
    const space = ' ';
    (figlet as any).parseFont('Sub-Zero', subzero); // disable type error
    figlet.text(
      'Shock\n' + space.repeat(7) + 'Mail',
      {
        font: 'Sub-Zero'
      },
      (err, data) => {
        if (!err) {
          console.log('\n' + data + '\n' + space.repeat(33) + 'We are seeking for best talents!');
        }
      }
    );
  }
}

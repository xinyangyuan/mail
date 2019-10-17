import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import * as AccountActions from '../../account/store/account.acion';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {
  isLoading: boolean;

  constructor(private store: Store) {}

  ngOnInit() {
    this.isLoading = true;
    this.store.dispatch(new AccountActions.GetAccountInfo()).subscribe(() => {
      this.isLoading = false;
    });
  }
}

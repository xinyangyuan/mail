import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { AuthState } from 'src/app/auth/store/auth.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation-list',
  templateUrl: './navigation-list.component.html',
  styleUrls: ['./navigation-list.component.css']
})
export class NavigationListComponent implements OnInit {
  @Select(AuthState.isSender) isSender$: Observable<boolean>;
  @Select(AuthState.email) email$: Observable<string>;

  constructor() {}

  ngOnInit() {}
}

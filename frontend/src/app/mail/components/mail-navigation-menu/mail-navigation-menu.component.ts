import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { MailRoutes } from '../../models/mail-route.model';
import { MailQuery } from '../../store/mail.query';

@Component({
  selector: 'app-mail-navigation-menu',
  templateUrl: './mail-navigation-menu.component.html',
  styleUrls: ['./mail-navigation-menu.component.css']
})
export class MailNavigationMenuComponent implements OnInit {
  // Attributes:
  @Select(MailQuery.routes) routes$: Observable<MailRoutes['routes']>;
  activateRoute;

  // Constructor:
  constructor(private route: ActivatedRoute) {}

  // Init Mehtod:
  ngOnInit() {}
}

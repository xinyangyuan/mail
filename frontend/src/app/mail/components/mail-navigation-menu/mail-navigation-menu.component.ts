import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
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
  currentRoute: { name: string; routerLink: string; icon: string };
  @Select(MailQuery.routes) routes$: Observable<MailRoutes['routes']>;

  // Constructor:
  constructor(private route: ActivatedRoute, private store: Store) {}

  // Init Mehtod:
  ngOnInit() {
    // Update currentRoute when activateRoute$ emit new url segment
    this.route.url.forEach(urlSegments => {
      const routes: MailRoutes['routes'] = this.store.selectSnapshot(MailQuery.routes);
      this.currentRoute = routes.find(route => route.routerLink === `/${urlSegments[0].path}`);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { MailQuery } from '../../store/mail.query';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mail-navigation',
  templateUrl: './mail-navigation.component.html',
  styleUrls: ['./mail-navigation.component.css']
})
export class MailNavigationComponent implements OnInit {
  // Attributes:
  @Select(MailQuery.userRole) userRole$: Observable<'USER' | 'SENDER'>;

  // Constructor:
  constructor() {}

  // Init Method:
  ngOnInit() {}
}

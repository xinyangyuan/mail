import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { MailState } from '../../store/mail.state';

@Component({
  selector: 'app-mail-list-page',
  templateUrl: './mail-list-page.component.html',
  styleUrls: ['./mail-list-page.component.css']
})
export class MailListPageComponent implements OnInit {
  // Attributes:
  @Select(MailState.selectMode) isSelectMode$: Observable<boolean>;

  constructor() {}

  ngOnInit() {}
}

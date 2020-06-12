import { Component, OnInit, OnDestroy } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';

import * as MailActions from '../../store/mail.action';
import { MailState } from '../../store/mail.state';
import { Mail } from '../../models/mail.model';
import { PageEvent } from '@angular/material/paginator';
import { MailQuery } from '../../store/mail.query';

@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.css']
})
export class MailListComponent implements OnInit, OnDestroy {
  // Attributes
  public urlData: Data;
  @Select(MailQuery.mails) mails$: Observable<Mail[]>;
  @Select(MailState.isLoading) isLoading$: Observable<boolean>;
  @Select(MailState.imageURLs) imageURLs$: Observable<{ [key: string]: SafeUrl }>;

  // Pagination
  public pageSizeOptions = [15, 30, 45, 6];
  @Select(MailQuery.mailCount) mailCount$: Observable<number>;
  @Select(MailState.currentPage) currentPage$: Observable<number>;
  @Select(MailState.mailsPerPage) mailsPerPage$: Observable<number>;

  // Constructor:
  constructor(private route: ActivatedRoute, private store: Store) {}

  // Init Method:
  ngOnInit() {
    // fetch mails from api
    this.urlData = this.route.snapshot.data;
    this.store.dispatch(new MailActions.GetMails(this.urlData));
  }

  // Method: call change page in paginator
  onChangedPage(pageData: PageEvent) {
    // change page status
    const currentPage = pageData.pageIndex + 1;
    const mailsPerPage = pageData.pageSize;

    // dispatch action
    this.store.dispatch(
      new MailActions.ChangePage({ currentPage, mailsPerPage, urlData: this.urlData })
    );
  }

  // Destroy Method:
  ngOnDestroy() {
    // abort mailList request when changes page
    this.store.dispatch(MailActions.ResetMailList);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MailService } from '../mail.service';
import { Mail } from '../mail.model';

@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.css']
})
export class MailListComponent implements OnInit, OnDestroy {
  public mails: Mail[];
  private mailServiceSub: Subscription;

  constructor(private mailService: MailService) {}

  // Init Method
  async ngOnInit() {
    this.mails = await this.mailService._getMailList();
  }

  // Destroy Method
  ngOnDestroy() {
    // cancel service subscriptions on destory
    // this.mailServiceSub.unsubscribe();
  }
}

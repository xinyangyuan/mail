import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { Mail } from './mail.model';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  // Attributes
  private mails: Mail[] = [
    {
      title: 'Mail: HSBC Bank Letter',
      description: 'Warning of Overdraft on Jan. 11th',
      content: 'The content of the mail + image of the envelop',
      read_flag: true,
      star_flag: false
    },

    {
      title: 'Mail: Thamewater Bill',
      description: 'Jan. Billing Information',
      content: 'The content of the mail + image of the envelop',
      read_flag: false,
      star_flag: false
    },

    {
      title: 'Mail: Barclays Bank Letter',
      description: 'Bank Statement of Jan',
      content: 'The content of the mail + image of the envelop',
      read_flag: false,
      star_flag: false
    }
  ];
  private mailsUpdated = new Subject<Mail[]>();

  // Constructor
  constructor(private router: Router) {}

  // Method: fetch mails
  getMails() {
    return [...this.mails];
  }

  // Method: subscribtion to the subject
  getMailsUpdatedListner() {
    return this.mailsUpdated.asObservable();
  }

  // Method: addding mail
  addMail(title: string, description: string, content: string) {
    const mail: Mail = { title, description, content, read_flag: false, star_flag: false };
    this.mails.push(mail);
    // tell subscribers new mail added
    this.mailsUpdated.next(this.getMails());
    this.router.navigate(['/']);
  }
}

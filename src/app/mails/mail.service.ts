import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { Mail } from './mail.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  // Attributes
  private BACKEND_URL = 'http://localhost:3000/api/mail/';

  // Attributes: observerables
  private mailsListObservable = new Subject<Mail[]>();
  private mailCreateObservable = new Subject<Mail>();
  private mailUpdateObservable = new Subject<Mail>();
  private mailDeletionObservable = new Subject<boolean>();

  // Constructor
  constructor(private http: HttpClient) {}

  /*
    Method: get a list of all user/sender's mails [GET]
  */

  getMailList() {
    // fetch mail list from the RESTapi
    this.http
      // send get request
      .get<{ message: string; mailList: Mail[] }>(this.BACKEND_URL)
      .subscribe(
        res => {
          this.mailsListObservable.next(res.mailList); // Todo: unpack needed?
          return res.mailList;
        },
        err => {
          console.log('Failed to fetch mail list!');
        }
      );
  }

  /*
    $ Method: get a list of all user/sender's mails [GET]
  */

  _getMailList() {
    // call getMailList method
    this.getMailList();

    // return mailListObservable
    return this.mailsListObservable.asObservable();
  }

  /*
    Method: create new mail [POST]
  */

  createMail(
    receiverId: string,
    title: string,
    description: string,
    content: string,
    envelop: File,
    contentPDF: File
  ) {
    // pack all required post data
    const mailData = new FormData();
    mailData.append('receiverId', receiverId);
    mailData.append('title', title);
    mailData.append('description', description);
    mailData.append('content', content);
    mailData.append('envelop', envelop);
    mailData.append('contentPDF', contentPDF);

    // post mailData to RESTapi
    this.http
      // send get request
      .post<{ message: string; mail: Mail }>(this.BACKEND_URL + 'create', mailData)
      .subscribe(
        res => {
          this.mailCreateObservable.next(res.mail);
          return res.mail;
        },
        err => {
          console.log('Failed to send the mail!');
        }
      );
  }

  /*
    $ Method: create new mail [POST]
  */

  _createMail(
    receiverId: string,
    title: string,
    description: string,
    content: string,
    envelop: File,
    contentPDF: File
  ) {
    // call createMail method
    this.createMail(receiverId, title, description, content, envelop, contentPDF);

    // return mailCreateObservable
    return this.mailCreateObservable.asObservable();
  }

  /*
    Method: update the mail's flag [PATCH]
  */

  updateMail(id: string, read_flag: boolean, star_flag: boolean) {
    // pack all required post data
    const mailData = { id, read_flag, star_flag };

    // post updated mail data to RESTapi
    this.http
      // send get request
      .patch<{ message: string; mail: Mail }>(this.BACKEND_URL + id, mailData)
      .subscribe(
        res => {
          this.mailUpdateObservable.next(res.mail);
          return res.mail;
        },
        err => {
          console.log('Failed to update mail flags!');
        }
      );
  }

  /*
    $ Method: update the mail's flag [PATCH]
  */

  _updateMail(id: string, read_flag: boolean, star_flag: boolean) {
    // call updateMail method
    this.updateMail(id, read_flag, star_flag);

    // return mailCreateObservable
    return this.mailUpdateObservable.asObservable();
  }

  /*
    Method: delete a mail  [DELETE]
  */
  deleteMail(id: string) {
    // post updated mail data to RESTapi
    this.http
      // send get request
      .delete<{ message: string; mail: Mail }>(this.BACKEND_URL + id)
      .subscribe(
        res => {
          this.mailDeletionObservable.next(true);
          return res.mail;
        },
        err => {
          console.log('Failed to update mail flags!');
        }
      );
  }

  /*
    $ Method: update the mail's flag [PATCH]
  */

  _deleteMail(id: string) {
    // call deleteMail method
    this.deleteMail(id);

    // return mailDeletetionObsevable
    return this.mailDeletionObservable.asObservable();
  }

  /*
    Method: delete a mail  [DELETE]
  */
  getContentPDF(id: string) {
    // post updated mail data to RESTapi
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return (
      this.http
        // send get request
        .get(this.BACKEND_URL + 'contentPDF/' + id, { headers: headers, responseType: 'blob' })
    );
  }
}

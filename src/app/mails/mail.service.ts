import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Mail } from './mail.model';
import { HttpClient } from '@angular/common/http';
// import { readFile } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  // Attributes
  private BACKEND_URL = 'http://localhost:3000/api/mail/';

  private mailList: Mail[] = [];
  private mailsUpdatedListener = new Subject<Mail[]>();

  // Constructor
  constructor(private http: HttpClient) {}

  /*
    Method: get a list of all addresses [GET]
  */

  getMailList() {
    // try to fetch mail list from local attribute
    if (this.mailList.length !== 0) {
      console.log('getMailList is called');
      return [...this.mailList] as Mail[];
    }

    // fetch address list from the RESTapi
    this.http
      // send get request
      .get<{ message: string; mailList: Mail[] }>(this.BACKEND_URL)
      .subscribe(
        res => {
          this.mailList = res.mailList;
          // this.mailsUpdatedListener.next({ mailList: [...this.mailList] });
          return [...this.mailList] as Mail[];
        },
        err => {
          console.log('Failed to fetch address list!');
        }
      );
  }

  /*
    Async Method: get a list of all addresses [GET]
  */

  async _getMailList() {
    // try to fetch mail list from local attribute
    if (this.mailList.length !== 0) {
      return [...this.mailList] as Mail[];
    }

    // fetch address list from the RESTapi
    try {
      // async http request to fetch mail list
      const data = await this.http
        .get<{ message: string; mailList: Mail[] }>(this.BACKEND_URL)
        .toPromise();
      this.mailList = data.mailList;

      return [...this.mailList];
    } catch {
      console.log('Failed to fetch address list!');
    }
  }

  /*
    Method: update the mail's flag [PATCH]
  */

  /*
    Method: delete a mail  [PATCH]
  */

  /*
    Method: create new mail [PATCH]
  */

  // updatePost(id: string, star_flag?: boolean, read_flag?: boolean) {
  //   // To do: this is awfully verbose..
  //   const update = { star_flag, read_flag };

  //   this.http.patch(this.BACKEND_URL + id, update).subscribe();

  // }

  /*
    Method: subscribtion to the subject
  */

  getMailsUpdatedListner() {
    return this.mailsUpdatedListener.asObservable();
  }
}

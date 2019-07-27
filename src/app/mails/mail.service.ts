import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Mail } from './mail.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  // Attributes
  private BACKEND_URL = environment.apiURL + '/mail/';

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

  _getMailList(
    mailsPerPage: number,
    currentPage: number,
    flags?: { readFlag?: boolean; starFlag?: boolean; issueFlag?: boolean }
  ): Observable<{ message: string; mailList: Mail[]; mailCount: number }> {
    // retrieve flags query
    let readFlagParam = '';
    let starFlagParam = '';
    let issueFlagParam = '';

    if (typeof flags !== 'undefined') {
      if (flags.hasOwnProperty('readFlag')) {
        readFlagParam = `&readFlag=${flags.readFlag.toString()}`;
      }
      if (flags.hasOwnProperty('starFlag')) {
        starFlagParam = `&starFlag=${flags.starFlag.toString()}`;
      }
      if (flags.hasOwnProperty('issueFlag')) {
        issueFlagParam = `&issueFlag=${flags.issueFlag.toString()}`;
      }
    }

    // set querParams
    const queryParams =
      `?mailsPerPage=${mailsPerPage}&currentPage=${currentPage}` +
      readFlagParam +
      starFlagParam +
      issueFlagParam;

    // fetch mail list from the RESTapi
    return (
      this.http
        // send get request
        .get<{ message: string; mailList: Mail[]; mailCount: number }>(
          this.BACKEND_URL + queryParams
        )
        .pipe(
          tap(
            res => {
              this.mailsListObservable.next(res.mailList);
              console.log(res.message);
            },
            err => {
              console.log('Failed to fetch mails');
            }
          ),
          catchError(error => throwError(error))
        )
    );
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
      .post<{ message: string; mail: Mail }>(this.BACKEND_URL, mailData)
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
  ): Observable<{ message: string; mail: Mail }> {
    // pack all required post data
    const mailData = new FormData();
    mailData.append('receiverId', receiverId);
    mailData.append('title', title);
    mailData.append('description', description);
    mailData.append('content', content);
    mailData.append('envelop', envelop);
    mailData.append('contentPDF', contentPDF);

    // call createMail method
    return (
      this.http
        // send get request
        .post<{ message: string; mail: Mail }>(this.BACKEND_URL, mailData)
        .pipe(
          tap(
            res => {
              this.mailCreateObservable.next(res.mail);
              console.log(res.message);
            },
            err => {
              console.log('Failed to send the mail!');
            }
          ),
          catchError(error => throwError(error))
        )
    );
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

  _updateMail(
    id: string,
    readFlag?: boolean,
    starFlag?: boolean,
    issueFlag?: boolean
  ): Observable<{ message: string; mail: Mail }> {
    // pack all required post data
    const mailData = { readFlag, starFlag, issueFlag };

    // post updated mail data to RESTapi
    return (
      this.http
        // send patch request
        .patch<{ message: string; mail: Mail }>(this.BACKEND_URL + id, mailData)
        .pipe(
          tap(
            res => {
              this.mailUpdateObservable.next(res.mail);
            },
            err => {
              console.log('Failed to update mail flags!');
            }
          )
        )
    );
  }

  /*
    Method: delete a mail  [DELETE]
  */
  deleteMail(id: string) {
    // post updated mail data to RESTapi
    this.http
      // send delete request
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
    $ Method: delete a mail  [DELETE]
  */

  _deleteMail(id: string): Observable<{ message: string; mail: Mail }> {
    // post updated mail data to RESTapi
    return (
      this.http
        // send delete request
        .delete<{ message: string; mail: Mail }>(this.BACKEND_URL + id)
        .pipe(
          tap(
            res => {
              this.mailDeletionObservable.next(true);
            },
            err => {
              console.log('Failed to update mail flags!');
            }
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    Method: get mail conten pdf  [GET]
  */
  getEnvelop(id: string) {
    // let headers = new HttpHeaders(); header already set by RESTapi
    // headers = headers.set('Accept', 'application/pdf');

    return (
      this.http
        // send get request
        .get(this.BACKEND_URL + 'envelop/' + id, { responseType: 'blob' })
        .pipe(
          map(file => {
            return { id, file };
          })
        )
    );
  }

  /*
    Method: get mail content pdf  [GET]
  */
  getContentPDF(id: string) {
    // let headers = new HttpHeaders(); header already set by RESTapi
    // headers = headers.set('Accept', 'application/pdf');

    return (
      this.http
        // send get request
        .get(this.BACKEND_URL + 'contentPDF/' + id, { responseType: 'blob' })
        .pipe(
          tap(
            res => {
              console.log('Get mail pdf suceessfully');
            },
            err => {
              console.log('Failed to get mail PDF!');
            }
          ),
          catchError(error => throwError(error))
        )
    );
  }
}

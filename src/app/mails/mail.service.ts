import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Mail, MailStatus } from './mail.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  // Attributes
  private BACKEND_URL = environment.apiURL + '/mail/';

  // Constructor
  constructor(private http: HttpClient) {}

  /*
    $ Method: get a list of all user/sender's mails [GET]
  */

  _getMailList(
    skip: number,
    limit: number,
    filterBy?: { read?: boolean; star?: boolean; issue?: boolean; status?: MailStatus }
  ): Observable<{ message: string; mailList: Mail[]; mailCount: number }> {
    // retrieve flags query
    let filterByString = '';
    for (const [filterName, filterValue] of Object.entries(filterBy)) {
      filterByString += '&' + filterName.toString() + '=' + filterValue.toString();
    }

    // set querParams
    const queryParams = `?skip=${skip}&limit=${limit}` + filterByString;

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
    $ Method: update the mail's flag or status [PATCH]
  */

  _updateMail(
    id: string,
    update: { flags?: { star?: boolean; read?: boolean; issue?: boolean }; status?: MailStatus }
  ): Observable<{ message: string; mail: Mail }> {
    // post updated mail data to RESTapi
    return (
      this.http
        // send patch request
        .patch<{ message: string; mail: Mail }>(this.BACKEND_URL + id, update)
        .pipe(
          tap(
            res => {
              // this.mailUpdateObservable.next(res.mail);
            },
            err => {
              console.log('Failed to update mail flags!');
            }
          )
        )
    );
  }

  /*
    $ Method: update the mails' flag [PATCH]
  */

  _updateMails(
    mails: Mail[],
    update: { flags?: { star?: boolean; read?: boolean; issue?: boolean }; status?: MailStatus }
  ): Observable<{ message: string; mail: Mail }> {
    // query params
    const ids: string = mails.map(mail => mail._id).join(',');
    const queryParams = `?ids=${ids}`;

    // post updated mail data to RESTapi
    return (
      this.http
        // send patch request
        .patch<{ message: string; mail: Mail }>(this.BACKEND_URL + queryParams, update)
        .pipe(
          tap(
            res => {},
            err => {
              console.log('Failed to update mail flags!');
            }
          )
        )
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
            res => {},
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
  getEnvelop(id: string): Observable<{ id: string; file: Blob }> {
    // let headers = new HttpHeaders(); header already set by RESTapi
    // headers = headers.set('Accept', 'application/pdf');

    return (
      this.http
        // send get request
        .get(this.BACKEND_URL + id + '/envelop/', { responseType: 'blob' })
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
        .get(this.BACKEND_URL + id + '/contentPDF/', { responseType: 'blob' })
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

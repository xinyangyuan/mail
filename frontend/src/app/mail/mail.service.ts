import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map, mergeMap, concatMap, flatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';

import { Mail } from './models/mail.model';
import { MailStatus } from './models/mail-status.model';

import * as MailActions from './store/mail.action';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  // Attributes
  private BACKEND_URL = environment.apiURL + '/mails/';

  // Constructor
  constructor(private http: HttpClient, private store: Store) {}

  /*
    $ Method: get a list of all user/sender's mails [GET]
  */

  _getMailList(
    skip: number,
    limit: number,
    filterBy?: { read?: boolean; star?: boolean; issue?: boolean; status?: MailStatus }
  ): Observable<{ mails: Mail[]; count: number }> {
    // retrieve flags query
    let filterByString = '';
    for (const [filterName, filterValue] of Object.entries(filterBy)) {
      filterByString += '&' + filterName.toString() + '=' + filterValue.toString();
    }

    // set querParams
    const queryParams = `?skip=${skip}&limit=${limit}` + filterByString;

    // fetch mail list from the RESTapi
    return this.http
      .get<{ ok: boolean; data: { mails: Mail[]; count: number } }>(this.BACKEND_URL + queryParams)
      .pipe(map(result => result.data));
  }

  /*
    $ Method: create new mail [POST]
  */

  _createMail(
    receiverId: string,
    title: string,
    description: string,
    content: string,
    envelop: File
  ): Observable<{ mail: Mail }> {
    // pack all required post data
    const mailData = new FormData();
    mailData.append('receiverId', receiverId);
    mailData.append('title', title);
    mailData.append('description', description);
    mailData.append('content', content);
    mailData.append('envelop', envelop);

    // call createMail method
    return this.http
      .post<{ ok: boolean; data: { mail: Mail } }>(this.BACKEND_URL, mailData)
      .pipe(map(result => result.data));
  }

  /*
    $ Method: modify mail content [PUT]
  */

  _modifyMail(
    mail: Mail,
    modfiedTitle: string,
    modifiedDescription: string,
    modifiedContent: string,
    modifiedEnvelop: File,
    modifiedContentPDF: File
  ): Observable<{ ok: boolean }> {
    // pack all required post data
    const mailData = new FormData();
    mailData.append('title', modfiedTitle);
    mailData.append('description', modifiedDescription);
    mailData.append('content', modifiedContent);
    mailData.append('envelop', modifiedEnvelop);
    mailData.append('contentPDF', modifiedContentPDF);

    // call createMail method
    return this.http.put<{ ok: boolean; result: { n: number; nModified: number } }>(
      this.BACKEND_URL + mail._id,
      mailData
    );
  }

  /*
    $ Method: update the mail's flag or status [PATCH]
  */

  _updateMail(
    mail: Mail,
    update: { flags?: { star?: boolean; read?: boolean; issue?: boolean }; status?: MailStatus }
  ): Observable<{ ok: boolean }> {
    // patch request
    return this.http
      .patch<{ ok: true; result: { n: number; nModified: number } }>(
        this.BACKEND_URL + mail._id,
        update
      )
      .pipe(tap(() => this.store.dispatch(new MailActions.UpdateMail({ mail, update }))));
  }

  /*
    $ Method: update the mails' flag or status [PATCH]
  */

  _updateMails(
    mails: Mail[],
    update: { flags?: { star?: boolean; read?: boolean; issue?: boolean }; status?: MailStatus }
  ): Observable<{ ok: boolean }> {
    // query params
    const ids: string = mails.map(mail => mail._id).join(',');
    const queryParams = `?ids=${ids}`;

    // post updated mail data to RESTapi
    return this.http
      .patch<{ ok: true; result: { n: number; nModified: number } }>(
        this.BACKEND_URL + queryParams,
        update
      )
      .pipe(tap(() => this.store.dispatch(new MailActions.UpdateMails({ mails, update }))));
  }

  /*
    $ Method: delete a mail  [DELETE]
  */

  _deleteMail(mail: Mail): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: true; result: { n: number; deletedCount: number } }>(
      this.BACKEND_URL + mail._id
    );
  }

  /*
    $ Method: get mail conten pdf  [GET]
  */

  _getEnvelop(id: string): Observable<{ id: string; file: Blob }> {
    return this.http.get(this.BACKEND_URL + id + '/envelop', { responseType: 'blob' }).pipe(
      map(file => {
        return { id, file };
      })
    );
  }

  /*
    $ Method: get mail content pdf  [GET]
  */

  _getContentPDF(mail: Mail) {
    return this.http.get(this.BACKEND_URL + mail._id + '/contentPDF', { responseType: 'blob' });
  }
}

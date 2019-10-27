import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordlessService {
  // Attributes
  private BACKEND_URL = environment.apiURL;

  // Constructor
  constructor(private http: HttpClient) {}

  /*
    $ Method: update the mail's  status [PATCH]
  */

  _updateMailStatus(id: string, emailToken: string): Observable<{ ok: boolean }> {
    return this.http.patch<{ ok: boolean; result: { n: number; nModified: number } }>(
      this.BACKEND_URL + `/mails/${id}/${emailToken}`,
      ''
    );
  }
}

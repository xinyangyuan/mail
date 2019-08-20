import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  _updateMailStatus(id: string, emailToken: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(this.BACKEND_URL + `/mail/${id}/${emailToken}`, '');
  }
}

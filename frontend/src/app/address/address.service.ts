import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Address } from './models/address.model';
import { Receiver } from './models/receivers.model';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  // Attributes:
  private BACKEND_URL = environment.apiURL + '/addresses/';

  // Constructor:
  constructor(private http: HttpClient) {}

  /*
    $ Method: get a list of all addresses [GET]
  */

  _getAddressList(): Observable<{ addresses: Address[] }> {
    return (
      // fetch address list from the RESTapi
      this.http
        .get<{ ok: boolean; data: { addresses: Address[] } }>(this.BACKEND_URL)
        // insert extra operations
        .pipe(
          map(result => result.data),
          tap(
            () => console.log('Fetch address list successfuly.'),
            () => console.log('Failed to fetch address list.')
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    $ Method: get address by id [GET]
  */

  _getAddressById(id: string): Observable<{ address: Address }> {
    return (
      // fetch address from the RESTapi
      this.http
        .get<{ ok: true; data: { address: Address } }>(this.BACKEND_URL + id)
        // insert extra operations
        .pipe(
          map(result => result.data),
          tap(
            () => console.log('Get address successfuly.'),
            () => console.log('Failed to fetch the address.')
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    $ Method: get address by senderId [GET]
  */

  _getAddressBySenderId(id: string): Observable<{ address: Address }> {
    return (
      // fetch address from the RESTapi
      this.http
        .get<{ ok: true; data: { address: Address } }>(this.BACKEND_URL + `senderId/${id}`)
        // insert extra operations
        .pipe(
          map(result => result.data),
          tap(
            () => console.log('Get address successfuly.'),
            () => console.log('Failed to fetch the address.')
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    $ Method: get address by receiverId [GET]
  */

  _getAddressByReceiverId(id: string): Observable<{ address: Address }> {
    return (
      // fetch address from the RESTapi
      this.http
        .get<{ ok: true; data: { address: Address } }>(
          this.BACKEND_URL + `receivers/receiverId/${id}`
        )
        // insert extra operations
        .pipe(
          map(result => result.data),
          tap(
            () => console.log('Get address successfuly.'),
            () => console.log('Failed to fetch the address.')
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    $ Method: get address's receivers [GET]: senders only
  */

  _getVacantMailboxNos(
    address: Address
  ): Observable<{ address: Address; vacantMailboxNos: number[] }> {
    return (
      // fetch my address from the RESTapi
      this.http
        .get<{ ok: boolean; data: { address: Address; vacantMailboxNos: number[] } }>(
          this.BACKEND_URL + address._id + '/vacantMailboxNos'
        )
        // insert extra operations
        .pipe(
          map(result => result.data),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    $ Method: get address's receivers [GET]: senders only
  */

  _getReceivers(address: Address): Observable<{ receivers: Receiver[] }> {
    return (
      // fetch my address from the RESTapi
      this.http
        .get<{ ok: boolean; data: { address: Address; receivers: Receiver[] } }>(
          this.BACKEND_URL + address._id + '/receivers'
        )
        .pipe(
          map(result => {
            return { receivers: result.data.receivers };
          }),
          tap(
            () => console.log('Get receivers successfuly.'),
            () => console.log('Failed to fetch the receivers data.')
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    $ Method: create new address [POST]: senders only
  */

  _createAddress(
    line1: string,
    city: string,
    zip: string,
    country: string,
    line2?: string
  ): Observable<{ address: Address }> {
    // pack all required post data
    const addressData = line2
      ? { line1, line2, city, zip, country }
      : { line1, city, zip, country };

    return (
      this.http
        .post<{ address: Address }>(this.BACKEND_URL, addressData)
        // insert extra operations
        .pipe(
          tap(
            () => console.log('New address created successfuly'),
            () => console.log('Failed to create a new address')
          ),
          catchError(error => throwError(error))
        )
    );
  }
}

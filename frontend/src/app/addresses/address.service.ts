import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Address, Receivers } from './address.model';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  // Attributes:
  private BACKEND_URL = environment.apiURL + '/address/';

  // Constructor:
  constructor(private http: HttpClient) {}

  /*
    $ Method: get a list of all addresses [GET]
  */

  _getAddressList(): Observable<{ addressList: Address[] }> {
    return (
      // fetch address list from the RESTapi
      this.http
        .get<{ message: string; addressList: Address[] }>(this.BACKEND_URL)
        // insert extra operations
        .pipe(
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

  _getAddress(id: string): Observable<{ address: Address }> {
    return (
      // fetch address from the RESTapi
      this.http
        .get<{ message: string; address: Address }>(this.BACKEND_URL + id)
        // insert extra operations
        .pipe(
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
  ): Observable<{ message: string; address: { _id: string; vacantMailboxNos: number[] } }> {
    return (
      // fetch my address from the RESTapi
      this.http
        .get<{ message: string; address: { _id: string; vacantMailboxNos: number[] } }>(
          this.BACKEND_URL + address._id + '/vacantMailboxNos'
        )
        // insert extra operations
        .pipe(catchError(error => throwError(error)))
    );
  }

  /*
    $ Method: get address's receivers [GET]: senders only
  */

  _getReceivers(
    address: Address
  ): Observable<{ message: string; address: { _id: string; receivers: Receivers[] } }> {
    return (
      // fetch my address from the RESTapi
      this.http
        .get<{ message: string; address: { _id: string; receivers: Receivers[] } }>(
          this.BACKEND_URL + address._id + '/receivers'
        )
        // insert extra operations
        .pipe(
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
    line2: string,
    city: string,
    zip: string,
    country: string
  ): Observable<{ address: Address }> {
    // pack all required post data
    const addressData = { line1, line2, city, zip, country };

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

  /*
    $ Method: add new receiver to an address [PATCH]: authenticated users
  */

  // _addReceiver(id: string, mailboxNo: number): Observable<{ address: Address }> {
  //   return (
  //     this.http
  //       // send post request to RESTapi
  //       .patch<{ address: Address }>(this.BACKEND_URL + id + '/receivers' , {mailboxNo} )
  //       .pipe(
  //         tap(
  //           () => console.log('You are added to the address successfully.'),
  //           () => console.log('Fail to add you to the address!')
  //         ),
  //         catchError(error => throwError(error))
  //       )
  //   );
}

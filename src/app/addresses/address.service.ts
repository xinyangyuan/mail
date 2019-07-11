import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Address } from './address.model';
import { AddressInfo } from './address-info.model';
import { Subject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  // Attributes:
  private BACKEND_URL = 'http://localhost:3000/api/address/';

  private addressList: Address[];
  private myAddress: Address;
  private myAddressInfo: AddressInfo;
  private addressListUpdated = new Subject<{ addressList: Address[] }>();

  // Constructor:
  constructor(private http: HttpClient) {}

  /*
    Method: get a list of all addresses [GET]: all users
  */

  getAddressList() {
    // try to fetch address list from local
    if (this.addressList.length !== 0) {
      return [...this.addressList] as Address[];
    }

    // fetch address list from the RESTapi
    this.http
      // send get request
      .get<{ addressList: Address[] }>(this.BACKEND_URL + 'list')
      .subscribe(
        res => {
          this.addressList = res.addressList;
          this.addressListUpdated.next({ addressList: [...this.addressList] });
          return [...this.addressList] as Address[];
        },
        err => {
          console.log('Failed to fetch address list!');
        }
      );
  }

  /*
    $ Method: get a list of all addresses [GET]: all users
  */

  _getAddressList(): Observable<{ addressList: Address[] }> {
    return (
      // fetch address list from the RESTapi
      this.http
        .get<{ addressList: Address[] }>(this.BACKEND_URL + 'list')
        // insert extra operations
        .pipe(
          tap(
            () => console.log('Fetch address list successfuly!'),
            () => console.log('Failed to fetch address list!')
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    Method: get my address [GET]: all users
  */

  getMyAddress() {
    // try to fetch my address from local
    if (this.myAddress) {
      return { ...this.myAddress };
    }

    // fetch my address from the RESTapi
    this.http
      // send get request
      .get<{ address: Address }>(this.BACKEND_URL)
      .subscribe(
        res => {
          this.myAddress = res.address;
          return { ...this.myAddress };
        },
        err => {
          console.log('Failed to fetch my address!');
        }
      );
  }

  /*
    $ Method: get my address [GET]: all users
  */

  _getMyAddress(): Observable<{ address: Address }> {
    return (
      // fetch my address from the RESTapi
      this.http
        .get<{ address: Address }>(this.BACKEND_URL)
        // insert extra operations
        .pipe(
          tap(
            () => console.log('Get address successfuly.'),
            () => console.log('Failed to fetch my address!')
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    Method: get my address information [GET]: senders only
  */

  getMyAddressInfo() {
    // try to fetch my address information from local
    if (this.myAddressInfo) {
      return { ...this.myAddressInfo };
    }

    // fetch my address info from the RESTapi
    this.http
      // send get request
      .get<{ addressInfo: AddressInfo }>(this.BACKEND_URL + 'info')
      .subscribe(
        res => {
          this.myAddressInfo = res.addressInfo;
          return { ...this.myAddressInfo };
        },
        err => {
          console.log('Failed to fetch my address information!');
        }
      );
  }

  /*
    $ Method: get my address information [GET]: senders only
  */

  _getMyAddressInfo(): Observable<{ addressInfo: AddressInfo }> {
    return (
      // fetch my address info from the RESTapi
      this.http
        .get<{ addressInfo: AddressInfo }>(this.BACKEND_URL + 'info')
        // insert extra operations
        .pipe(
          tap(
            () => console.log('Fetch address information successfuly.'),
            () => console.log('Failed to fetch my address information!')
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    Method: add new addresses [POST]: senders only
  */

  createAddress(address: string, address2: string, city: string, zipCode: string, country: string) {
    // pack all required post data
    const addressData = { address, address2, city, zipCode, country };

    this.http
      // send post request to RESTapi
      .post<{ addressInfo: AddressInfo }>(this.BACKEND_URL + 'new', addressData)
      .subscribe(
        res => {
          this.myAddressInfo = res.addressInfo;
          return this.myAddressInfo;
        },
        err => {
          console.log('Failed to create a new address!');
        }
      );
  }

  /*
    $ Method: get my address information [GET]: senders only
  */

  _createAddress(
    address: string,
    address2: string,
    city: string,
    zipCode: string,
    country: string
  ): Observable<{ addressInfo: AddressInfo }> {
    // pack all required post data
    const addressData = { address, address2, city, zipCode, country };

    return (
      this.http
        .post<{ addressInfo: AddressInfo }>(this.BACKEND_URL + 'new', addressData)
        // insert extra operations
        .pipe(
          tap(
            () => console.log('New address created successfuly.'),
            () => console.log('Failed to create a new address!')
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    Method: add new receiver to an address [PATCH]: senders only
  */

  addReceiver(addressId: string) {
    this.http
      // send post request to RESTapi
      .patch<{ address: Address }>(this.BACKEND_URL + 'addReceiver', { addressId })
      .subscribe(
        res => {
          this.myAddress = res.address;
          console.log('You are added to the address successfully.');
        },
        error => {
          console.log('Fail to add you to the address!');
        }
      );
  }

  /*
    $ Method: add new receiver to an address [PATCH]: senders only
  */

  _addReceiver(addressId: string): Observable<{ address: Address }> {
    return (
      this.http
        // send post request to RESTapi
        .patch<{ address: Address }>(this.BACKEND_URL + 'addReceiver', { addressId })
        .pipe(
          tap(
            () => console.log('You are added to the address successfully.'),
            () => console.log('Fail to add you to the address!')
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    Method: add address update listner
  */

  getAddressUpdateListener() {
    return this.addressListUpdated.asObservable();
  }
}

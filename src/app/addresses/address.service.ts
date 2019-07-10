import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { Address } from './address.model';
import { AddressInfo } from './address-info.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  // Attributes:
  private BACKEND_URL = 'http://localhost:3000/api/address/';

  private addressList: Address[] = [];
  private myAddress: Address;
  private myAddressInfo: AddressInfo;
  private addressListUpdated = new Subject<{ addressList: Address[] }>();

  // Constructor:
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  /*
    Method: get a list of all addresses [GET]: all users
  */

  getAddressList() {
    // try to fetch address list from local
    if (this.addressList.length !== 0) {
      console.log('getAddressList is called');
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
    Async Method: get a list of all addresses ONSITE [GET]: all users
  */

  async _getAddressList() {
    // try to fetch address list from local
    if (this.addressList.length !== 0) {
      return [...this.addressList] as Address[];
    }

    try {
      const data = await this.http
        .get<{ addressList: Address[] }>(this.BACKEND_URL + 'list')
        .toPromise();
      this.addressList = data.addressList;
      this.addressListUpdated.next({ addressList: [...this.addressList] });
      return [...this.addressList] as Address[];
    } catch {
      console.log('Failed to fetch address list!');
    }
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
          console.log(this.myAddress);
          console.log('Get address successfuly.');
          return { ...this.myAddress };
        },
        err => {
          console.log('Failed to fetch my address!');
        }
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
          console.log('Failed to fetch my address!');
        }
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
    Method: add new receiver to an address [PATCH]: senders only
  */

  addReceiver(addressId: string) {
    this.http
      // send post request to RESTapi
      .patch<{ address: Address }>(this.BACKEND_URL + 'addReceiver', addressId)
      .subscribe(
        res => {
          this.myAddress = res.address;
          console.log('You are added to the address successfully.');
        },
        error => {
          console.log('Faile to add you to the address!');
        }
      );
  }
  /*
    Method: add address update listner
  */

  getAddressUpdateListener() {
    return this.addressListUpdated.asObservable();
  }
}

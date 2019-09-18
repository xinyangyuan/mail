export interface Address {
  _id: string;
  line1: string;
  line2?: string;
  city: string;
  zip: string;
  country: string;
}

export interface Mailbox {
  address: Address;
  mailboxNo: number;
}

export class Receivers {
  _id: string;
  name: { first: string; last: string };
  get fullname() {
    return this.name.first + this.name.last;
  }
}

import { Address } from '../models/address.model';
import { FormGroup } from '@angular/forms';

/*
    Action
*/

export class GetAddresses {
  static readonly type = '[Address Select Form Component] Get Addresses';
}

export class GetAddress {
  static readonly type = '[] Get Address';
  constructor(public payload: string) {}
}

export class GetVacantMailboxNos {
  static readonly type = '[Address Select Form Component] Get Address VacantMailboxNos';
  constructor(public payload: Address) {}
}

export class GetReceivers {
  static readonly type = '[Mail Create Page] Get Address Receivers';
  constructor(public payload: Address) {}
}

export class SelectMailbox {
  static readonly type = '[Address Select Form Component] Select Mailbox';
  constructor(public payload: { address: Address; mailboxNo: number }) {}
}

export class CreateAddress {
  static readonly type = '[Address Create Page] Create Address';
  constructor(public payload: FormGroup) {}
}

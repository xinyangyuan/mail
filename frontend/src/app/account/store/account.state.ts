import { State, Selector, StateContext, Action } from '@ngxs/store';

import { User } from 'src/app/auth/models/user.model';

import { Address } from 'src/app/address/models/address.model';
import { AddressService } from 'src/app/address/address.service';
import { AuthService } from 'src/app/auth/auth.service';
import * as AccountActions from './account.acion';

/*
   Account State
*/

export interface AccountStateModel {
  user: User;
  address: Address;
}

/*
   Initial State
*/

const initialState: AccountStateModel = {
  user: null,
  address: null
};

/*
   Action Map:
*/

@State<AccountStateModel>({ name: 'account', defaults: initialState })
export class AccountState {
  // Constructor:
  constructor(private addressService: AddressService, private authService: AuthService) {}

  /*
   Selectors:
  */

  @Selector()
  static user(state: AccountStateModel) {
    return state.user;
  }

  @Selector()
  static address(state: AccountStateModel) {
    return state.address;
  }

  /*
   Action: get account information after sign-in
  */

  @Action(AccountActions.GetAccountInfo)
  async getAccountInfo(ctx: StateContext<AccountStateModel>) {
    // $1: get user info
    const { user } = await this.authService._getMyInfo().toPromise();

    // $2: get address info
    // const {address} = await this.addressService._getAddressBySenderId().toPromise()

    // update state
  }
}

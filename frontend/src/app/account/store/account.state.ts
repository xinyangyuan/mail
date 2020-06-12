import { Injectable } from "@angular/core";
import { State, Selector, StateContext, Action } from "@ngxs/store";

import { User } from "src/app/auth/models/user.model";
import { Receiver } from "src/app/address/models/receivers.model";
import { AddressService } from "src/app/address/address.service";
import { AuthService } from "src/app/auth/auth.service";
import * as AccountActions from "./account.acion";

/*
   Account State
*/

export interface AccountStateModel {
  user: User;
  addressId: string;
  receivers: Receiver[];
}

/*
   Initial State
*/

const initialState: AccountStateModel = {
  user: null,
  addressId: null,
  receivers: null,
};

/*
   Action Map:
*/

@State<AccountStateModel>({ name: "account", defaults: initialState })
@Injectable()
export class AccountState {
  // Constructor:
  constructor(
    private addressService: AddressService,
    private authService: AuthService
  ) {}

  /*
   Selectors:
  */

  @Selector()
  static user(state: AccountStateModel) {
    return state.user;
  }

  @Selector()
  static userEmail(state: AccountStateModel) {
    return state.user.email;
  }

  @Selector()
  static userRole(state: AccountStateModel) {
    return state.user.role;
  }

  @Selector()
  static userFullname(state: AccountStateModel) {
    return state.user.fullname();
  }

  @Selector()
  static addressId(state: AccountStateModel) {
    return state.addressId;
  }

  /*
   Action: get account information after sign-in
  */

  @Action(AccountActions.GetAccountInfo)
  async getAccountInfo(ctx: StateContext<AccountStateModel>) {
    // $1: get user info
    const { user } = await this.authService._getMyInfo().toPromise();

    // $2: get addressId & update state
    if (user.role === "SENDER") {
      const { address } = await this.addressService
        ._getAddressBySenderId(user._id)
        .toPromise();
      const { receivers } = await this.addressService
        ._getReceivers(address)
        .toPromise();
      ctx.patchState({ user, receivers, addressId: address._id });
    } else {
      const { address } = await this.addressService
        ._getAddressByReceiverId(user._id)
        .toPromise();
      ctx.patchState({ user, addressId: address._id });
    }
  }
}

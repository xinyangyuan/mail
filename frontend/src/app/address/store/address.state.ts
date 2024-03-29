import { Injectable } from "@angular/core";
import { State, Selector, Action, StateContext } from "@ngxs/store";

import { Address } from "../models/address.model";
import { Receiver } from "../models/receivers.model";

import * as AddressActions from "./address.action";
import { AddressService } from "../address.service";

/*
   Address State
*/

export interface AddressStateModel {
  address: Address;
  addresses: Address[];
  selectedMailbox: {
    address: Address;
    mailboxNo: number;
  };
  receivers: Receiver[];
  vacantMailboxNos: number[];
}

/*
   Initial State
*/

const initialState: AddressStateModel = {
  address: null,
  addresses: [],
  selectedMailbox: null,
  receivers: [],
  vacantMailboxNos: [],
};

/*
   Action Map:
*/

@State<AddressStateModel>({ name: "address", defaults: initialState })
@Injectable()
export class AddressState {
  // Constructor:
  constructor(private addressService: AddressService) {}

  /*
   Selectors:
  */

  @Selector()
  static addresses(state: AddressStateModel) {
    return state.addresses;
  }

  @Selector()
  static address(state: AddressStateModel) {
    return state.address;
  }

  @Selector()
  static selectedMailbox(state: AddressStateModel) {
    return state.selectedMailbox;
  }

  @Selector()
  static receivers(state: AddressStateModel) {
    return state.receivers;
  }

  @Selector()
  static vacantMailboxNos(state: AddressStateModel) {
    return state.vacantMailboxNos;
  }

  /*
   Action: get address list
  */

  @Action(AddressActions.GetAddresses)
  async getAddresses(ctx: StateContext<AddressStateModel>) {
    // async service call
    const result = await this.addressService._getAddressList().toPromise();

    // return new state
    ctx.patchState({ addresses: result.addresses });
  }

  /*
   Action: get address by id
  */

  @Action(AddressActions.GetAddress, { cancelUncompleted: true })
  async getAddress(
    ctx: StateContext<AddressStateModel>,
    action: AddressActions.GetAddress
  ) {
    // async service call
    const result = await this.addressService
      ._getAddressById(action.payload)
      .toPromise();

    // return new state
    ctx.patchState({ address: result.address });
  }

  /*
   Action: get address's receivers
  */

  @Action(AddressActions.GetReceivers, { cancelUncompleted: true })
  async getReceivers(
    ctx: StateContext<AddressStateModel>,
    action: AddressActions.GetReceivers
  ) {
    // async service call
    const result = await this.addressService
      ._getReceivers(action.payload)
      .toPromise();

    // return new state
    ctx.patchState({ receivers: result.receivers });
  }

  /*
   Action: get address's vacant mailboxes
  */

  @Action(AddressActions.GetVacantMailboxNos, { cancelUncompleted: true })
  async getVacantMailboxNos(
    ctx: StateContext<AddressStateModel>,
    action: AddressActions.GetVacantMailboxNos
  ) {
    // async service call
    const result = await this.addressService
      ._getVacantMailboxNos(action.payload)
      .toPromise();

    // return new state
    ctx.patchState({ vacantMailboxNos: result.vacantMailboxNos });
  }

  /*
   Action: select address
  */

  @Action(AddressActions.SelectMailbox)
  selectAddress(
    ctx: StateContext<AddressStateModel>,
    action: AddressActions.SelectMailbox
  ) {
    const { address, mailboxNo } = action.payload;
    // return new state
    ctx.patchState({
      selectedMailbox: { address, mailboxNo },
    });
  }

  /*
   Action: create address
  */
}

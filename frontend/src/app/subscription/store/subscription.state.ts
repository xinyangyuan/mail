import { Injectable } from "@angular/core";
import { State, Action, StateContext } from "@ngxs/store";

import { Subscription } from "../models/subscription.model";
import * as SubscriptionActions from "./subscription.action";
import { SubscriptionService } from "../subscription.service";
import { PaymentService } from "src/app/payment/payment.service";

/*
   Plan State
*/

export interface SubscriptionStateModel {
  subscription: Subscription;
}

/*
   Initial State
*/

const initialState: SubscriptionStateModel = {
  subscription: null,
};

/*
   Action Map:
*/

@State<SubscriptionStateModel>({ name: "subscription", defaults: initialState })
@Injectable()
export class SubscriptionState {
  // Constructor:
  constructor(
    private subscriptionService: SubscriptionService,
    private paymentService: PaymentService
  ) {}

  /*
   Action: new subscription
  */

  @Action(SubscriptionActions.CreateSubscription)
  async createSubscription(
    ctx: StateContext<SubscriptionState>,
    action: SubscriptionActions.CreateSubscription
  ) {
    // rest api call
    const { source, plan, mailbox } = action.payload;
    const {
      paymentIntent,
    } = await this.subscriptionService
      ._createSubscription(plan, source, mailbox)
      .toPromise();

    // handle paymentIntent result [3d secure modal for require_actions]
    await this.paymentService._handlePaymentIntent(paymentIntent);
  }
}

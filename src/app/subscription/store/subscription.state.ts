import { State, Action, StateContext } from '@ngxs/store';

import { PaymentService } from 'src/app/payment/payment.service';
import * as SubscriptionActions from './subscription.action';
import { SubscriptionService } from '../subscription.service';

/*
   Plan State
*/

export interface SubscriptionStateModel {
  // subscription;
}

/*
   Initial State
*/

const initialState: SubscriptionStateModel = {
  // subscription
};

/*
   Action Map:
*/

@State<SubscriptionStateModel>({ name: 'subscription', defaults: initialState })
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
    await this.subscriptionService._createSubscription(plan, source, mailbox).toPromise();

    // handle result
    // await this.paymentService._handlePaymentIntent();
  }
}

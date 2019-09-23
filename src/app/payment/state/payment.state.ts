import { State, Selector, Action, StateContext } from '@ngxs/store';

import * as PaymentActions from './payment.action';
import { PaymentService } from '../payment.service';

/*
   Payment State
*/

export interface PaymentStateModel {
  source: stripe.Source;
  paymentStatus: 'pending' | 'requires_action' | 'success' | 'error';
  paymentIntentResponse: stripe.PaymentIntentResponse;
}

/*
   Initial State
*/

const initialState: PaymentStateModel = {
  source: null,
  paymentStatus: null,
  paymentIntentResponse: null
};

/*
   Action Map:
*/

@State<PaymentStateModel>({ name: 'payment', defaults: initialState })
export class PaymentState {
  // Constructor:
  constructor(private paymentService: PaymentService) {}

  /*
   Selectors:
  */

  @Selector()
  static source(state: PaymentStateModel) {
    return state.source;
  }

  @Selector()
  static paymentStatus(state: PaymentStateModel) {
    return state.paymentStatus;
  }

  @Selector()
  static paymentIntentResponse(state: PaymentStateModel) {
    return state.paymentIntentResponse;
  }

  /*
   Action: open payment
  */

  @Action(PaymentActions.OpenPayment)
  async openPayment(ctx: StateContext<PaymentStateModel>, action: PaymentActions.OpenPayment) {
    // return new state
    ctx.setState({ source: null, paymentIntentResponse: null, paymentStatus: 'pending' });
    // side effect:
    if (action.showLoading) {
      this.paymentService.openDialog();
    }
  }

  /*
   Action: payment source created
  */

  @Action(PaymentActions.PaymentSourceCreated)
  paymentSourceCreated(
    ctx: StateContext<PaymentStateModel>,
    action: PaymentActions.PaymentSourceCreated
  ) {
    // return new state
    ctx.patchState({ source: action.payload });
  }

  /*
   Action: payment requires action, 3d-secure
  */

  @Action(PaymentActions.PaymentRequiresAction)
  paymentRequiresAction(ctx: StateContext<PaymentStateModel>) {
    // return new state
    ctx.patchState({ paymentStatus: 'requires_action' });
  }

  /*
   Action: payment succeeded
  */

  @Action(PaymentActions.PaymentSucceeded)
  paymentSucceeded(ctx: StateContext<PaymentStateModel>, action: PaymentActions.PaymentSucceeded) {
    // return new state
    ctx.patchState({
      paymentStatus: 'success',
      paymentIntentResponse: action.payload
    });
  }

  /*
   Action: payment requires action, 3d-secure
  */

  @Action(PaymentActions.PaymentFailed)
  paymentFailed(ctx: StateContext<PaymentStateModel>, action: PaymentActions.PaymentFailed) {
    // return new state
    ctx.patchState({
      paymentStatus: 'error',
      paymentIntentResponse: action.payload
    });
  }
}

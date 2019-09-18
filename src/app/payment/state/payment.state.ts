import { MatDialog, MatDialogRef } from '@angular/material';
import { State, Selector, Action, StateContext } from '@ngxs/store';

import * as PaymentActions from './payment.action';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';

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
  // Attributes
  private paymentDialog: MatDialogRef<PaymentModalComponent>;

  // Constructor
  constructor(private dialog: MatDialog) {}

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
  openPayment(ctx: StateContext<PaymentStateModel>, action: PaymentActions.OpenPayment) {
    // return new state
    ctx.setState({
      source: null,
      paymentIntentResponse: null,
      paymentStatus: 'pending'
    });

    // SIDE EFFECT: open payment status modal
    if (action.showLoading) {
      this.paymentDialog = this.dialog.open(PaymentModalComponent);
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
   Action: close payment [clear the store]
  */

  // @Action(PaymentActions.ClosePayment)
  // closePayment(ctx: StateContext<PaymentStateModel>) {
  //   // reset store
  //   ctx.setState({ ...initialState });
  // }

  /*
   Action: payment requires action, 3d-secure
  */

  @Action(PaymentActions.PaymentRequiresAction)
  paymentRequiresAction(ctx: StateContext<PaymentStateModel>) {
    // return new state
    ctx.patchState({ paymentStatus: 'requires_action' });

    // SIDE EFFECT: closes payment status modal, since the 3d-secure modal will pop-up
    if (this.paymentDialog) {
      this.paymentDialog.close();
    }
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

    // SIDE EFFECT:
    if (action.showResult && !this.paymentDialog) {
      this.dialog.open(PaymentModalComponent);
    }
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

    // SIDE EFFECT:
    if (action.showResult && !this.paymentDialog) {
      this.dialog.open(PaymentModalComponent);
    }
  }
}

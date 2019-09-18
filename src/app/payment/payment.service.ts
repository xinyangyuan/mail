import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { environment } from 'src/environments/environment';
import * as PaymentActions from './state/payment.action';

declare var Stripe: stripe.StripeStatic;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  // Attributes:
  stripe = Stripe(environment.stripeKey);

  // Constructor:
  constructor(private store: Store) {}

  /*
    $ Method: handle payment_intent
  */

  async _handlePaymentIntent(paymentIntent: stripe.paymentIntents.PaymentIntent) {
    // status & secret
    const status: stripe.paymentIntents.PaymentIntentStatus = paymentIntent.status;
    const clientSecret: string = paymentIntent.client_secret;

    // handle paymentIntent
    switch (status) {
      case 'succeeded':
        this.store.dispatch(new PaymentActions.PaymentSucceeded({ paymentIntent }));
        break;
      case 'requires_action':
        // handle 3d secure
        const { error, paymentIntent: result } = await this.stripe.handleCardAction(clientSecret);
        if (error) {
          this.store.dispatch(new PaymentActions.PaymentFailed({ error }));
          console.log(error);
        } else {
          this.store.dispatch(new PaymentActions.PaymentSucceeded({ paymentIntent: result }));
          console.log(result);
        }
        break;
      default:
        // default error payment intent
        this.store.dispatch(new PaymentActions.PaymentFailed({ paymentIntent }));
        console.log(paymentIntent);
    }
  }
}

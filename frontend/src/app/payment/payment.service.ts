import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngxs/store";

import { environment } from "src/environments/environment";
import * as PaymentActions from "./store/payment.action";
import { PaymentModalComponent } from "./components/payment-modal/payment-modal.component";

declare var Stripe: stripe.StripeStatic;

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  // Attributes:
  stripe: stripe.Stripe;
  private stripeKey: string;
  private paymentDialogRef: MatDialogRef<PaymentModalComponent>;
  private BACKEND_URL = environment.apiURL + "/stripe/pk";

  // Constructor:
  constructor(
    private store: Store,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    this.http
      .get<{ data: { pk: string } }>(this.BACKEND_URL)
      .toPromise()
      .then((response) => {
        this.stripeKey = response.data.pk; // get stripeKey from backend
        this.stripe = Stripe(this.stripeKey);
      });
  }

  /*
    Method: open dialog
  */

  openDialog() {
    this.paymentDialogRef = this.dialog.open(PaymentModalComponent);
  }

  /*
    Method: close dialog
  */

  closeDialog() {
    this.paymentDialogRef.close();
  }

  /*
    $ Method: handle payment_intent
  */

  async _handlePaymentIntent(
    paymentIntent: stripe.paymentIntents.PaymentIntent
  ) {
    // status & secret
    const status: stripe.paymentIntents.PaymentIntentStatus =
      paymentIntent.status;
    const clientSecret: string = paymentIntent.client_secret;

    // handle paymentIntent
    switch (status) {
      case "succeeded":
        this.store.dispatch(
          new PaymentActions.PaymentSucceeded({ paymentIntent })
        );
        break;
      case "requires_action":
        // handle 3d secure
        const {
          error,
          paymentIntent: result,
        } = await this.stripe.handleCardAction(clientSecret);
        if (error) {
          this.store.dispatch(new PaymentActions.PaymentFailed({ error }));
          throw Error(error.message);
        } else {
          this.store.dispatch(
            new PaymentActions.PaymentSucceeded({ paymentIntent: result })
          );
        }
        break;
      default:
        // default error payment intent
        this.store.dispatch(
          new PaymentActions.PaymentFailed({ paymentIntent })
        );
        throw Error("Invalid paymentIntent status");
    }
  }
}

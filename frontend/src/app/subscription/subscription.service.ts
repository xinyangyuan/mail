import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Plan } from '../plan/plan.model';
import { Mailbox } from '../address/models/mailbox.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  // Attributes
  private BACKEND_URL = environment.apiURL + '/subscription/';

  // Constructor
  constructor(private http: HttpClient) {}

  /*
    $ Method: create new subscription [POST]
  */

  _createSubscription(plan: Plan, source: stripe.Source, mailbox: Mailbox) {
    // pack all required post data
    const { address, mailboxNo } = mailbox;
    const subscriptionData = { source, mailboxNo, addressId: address._id, planIds: plan.ids };

    console.log(subscriptionData);

    // post api call
    return this.http
      .post<{ message: string; paymentIntent: stripe.paymentIntents.PaymentIntent }>(
        this.BACKEND_URL,
        subscriptionData
      )
      .pipe(
        tap(response => {
          console.log(response);
        })
      );
  }
}

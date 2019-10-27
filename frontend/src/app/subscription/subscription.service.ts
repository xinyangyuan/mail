import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Plan } from '../plan/plan.model';
import { Subscription } from './models/subscription.model';
import { Mailbox } from '../address/models/mailbox.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  // Attributes
  private BACKEND_URL = environment.apiURL + '/subscriptions/';

  // Constructor
  constructor(private http: HttpClient) {}

  /*
    $ Method: create new subscription [POST]
  */

  _createSubscription(
    plan: Plan,
    source: stripe.Source,
    mailbox: Mailbox
  ): Observable<{
    paymentIntent: stripe.paymentIntents.PaymentIntent;
    subscription: Subscription;
  }> {
    // pack all required post data
    const { address, mailboxNo } = mailbox;
    const subscriptionData = { source, mailboxNo, addressId: address._id, planIds: plan.ids };

    // post api call
    return this.http
      .post<{
        ok: boolean;
        data: { paymentIntent: stripe.paymentIntents.PaymentIntent; subscription: Subscription };
      }>(this.BACKEND_URL, subscriptionData)
      .pipe(map(result => result.data));
  }
}

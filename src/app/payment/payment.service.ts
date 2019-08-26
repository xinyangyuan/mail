import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare var Stripe: stripe.StripeStatic;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor() {}

  stripe = Stripe(environment.stripeKey);
}

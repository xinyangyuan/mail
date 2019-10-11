import { Plan } from 'src/app/plan/plan.model';
import { Mailbox } from 'src/app/address/models/mailbox.model';

export class CreateSubscription {
  static readonly type = '[New Subscription Checkout Component] Create Subscription';
  constructor(public payload: { source: stripe.Source; plan: Plan; mailbox: Mailbox }) {}
}

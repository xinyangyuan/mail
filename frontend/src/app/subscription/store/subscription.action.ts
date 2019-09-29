import { Plan } from 'src/app/plans/plan.model';
import { Mailbox } from 'src/app/addresses/address.model';

export class CreateSubscription {
  static readonly type = '[New Subscription Checkout Component] Create Subscription';
  constructor(public payload: { source: stripe.Source; plan: Plan; mailbox: Mailbox }) {}
}

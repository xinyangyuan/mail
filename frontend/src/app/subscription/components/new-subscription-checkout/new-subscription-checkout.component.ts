import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';

import { Plan } from 'src/app/plan/plan.model';
import { Address } from 'src/app/address/models/address.model';
import { Mailbox } from 'src/app/address/models/mailbox.model';
import { SubscriptionQuery } from '../../store/subscription.query';
import * as SubscriptionActions from '../../store/subscription.action';

@Component({
  selector: 'app-new-subscription-checkout',
  templateUrl: './new-subscription-checkout.component.html',
  styleUrls: ['./new-subscription-checkout.component.css']
})
export class NewSubscriptionCheckoutComponent implements OnInit {
  // Attributes
  @Select(SubscriptionQuery.selectedPlan) plan$: Observable<Plan>;
  @Select(SubscriptionQuery.selectedMailbox) mailbox$: Observable<Mailbox>;
  address$: Observable<Address>;
  mailboxNo$: Observable<number>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.address$ = this.mailbox$.pipe(map(mailbox => mailbox.address));
    this.mailboxNo$ = this.mailbox$.pipe(map(mailbox => mailbox.mailboxNo));
  }

  onPay(source: stripe.Source) {
    const plan = this.store.selectSnapshot(SubscriptionQuery.selectedPlan);
    const mailbox = this.store.selectSnapshot(SubscriptionQuery.selectedMailbox);
    this.store
      .dispatch(new SubscriptionActions.CreateSubscription({ source, plan, mailbox }))
      .subscribe(() => this.router.navigate(['']));
  }
}

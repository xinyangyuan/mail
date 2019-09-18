import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { SubscriptionQuery } from '../store/subscription.query';
import { NewSubscriptionSelectAddressComponent } from '../new-subscription-select-address/new-subscription-select-address.component';
import { NewSubscriptionSelectPlanComponent } from '../new-subscription-select-plan/new-subscription-select-plan.component';
import { NewSubscriptionCheckoutComponent } from '../new-subscription-checkout/new-subscription-checkout.component';

@Component({
  selector: 'app-new-subscription',
  templateUrl: './new-subscription.component.html',
  styleUrls: ['./new-subscription.component.css']
})
export class NewSubscriptionComponent implements OnInit {
  // Attributes
  component;

  // Constructor:
  constructor(private route: ActivatedRoute, private router: Router, private store: Store) {}

  // Init method:
  ngOnInit() {
    // Dynamic component:
    this.route.fragment.forEach(fragment => {
      // check selectedPlan and selectedMailbox
      const selectedMailbox = this.store.selectSnapshot(SubscriptionQuery.selectedMailbox);
      const selectedPlan = this.store.selectSnapshot(SubscriptionQuery.selectedPlan);

      switch (fragment) {
        case 'select-address':
          this.component = NewSubscriptionSelectAddressComponent;
          break;
        case 'select-plan':
          if (selectedMailbox) {
            this.component = NewSubscriptionSelectPlanComponent;
            break;
          }
        case 'checkout':
          if (selectedMailbox && selectedPlan) {
            this.component = NewSubscriptionCheckoutComponent;
            break;
          }
        default:
          this.router.navigate([], {
            fragment: 'select-address'
          });
      }
    });

    // Prevent closing & refresh tab
    window.addEventListener('beforeunload', event => {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = '';
      return ''; // Gecko, WebKit, Chrome <34
    });
  }
}

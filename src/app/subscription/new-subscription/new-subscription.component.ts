import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  constructor(private route: ActivatedRoute, private router: Router) {}

  // Init method:
  ngOnInit() {
    this.route.fragment.forEach(fragment => {
      switch (fragment) {
        case 'select-address':
          this.component = NewSubscriptionSelectAddressComponent;
          break;
        case 'select-plan':
          this.component = NewSubscriptionSelectPlanComponent;
          break;
        case 'checkout':
          this.component = NewSubscriptionCheckoutComponent;
          break;
        default:
          this.router.navigate([], { fragment: 'select-address' });
      }
    });
  }
}

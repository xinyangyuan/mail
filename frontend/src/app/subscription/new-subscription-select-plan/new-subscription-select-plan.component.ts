import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';

import { Plan } from 'src/app/plans/plan.model';
import { SubscriptionQuery } from '../store/subscription.query';

@Component({
  selector: 'app-new-subscription-select-plan',
  templateUrl: './new-subscription-select-plan.component.html',
  styleUrls: ['./new-subscription-select-plan.component.css']
})
export class NewSubscriptionSelectPlanComponent implements OnInit {
  // Attributes:
  @Select(SubscriptionQuery.selectedPlan) selectedPlan$: Observable<Plan>;
  isMonthly: boolean;
  planType: Plan['type'];

  // Contructor:
  constructor(private store: Store) {}

  // Init method:
  ngOnInit() {
    // check whether use has already selected plan
    const selectedPlan = this.store.selectSnapshot(SubscriptionQuery.selectedPlan);
    this.isMonthly = selectedPlan && selectedPlan.type === 'annual' ? false : true; // guard operator:
    this.planType = selectedPlan && selectedPlan.type === 'annual' ? 'annual' : 'monthly'; // second cond only checked if first is true
  }

  // Method: update plan list type when toggle selector
  onToggle(event: boolean) {
    if (event) {
      this.isMonthly = false;
      this.planType = 'annual';
    } else {
      this.isMonthly = true;
      this.planType = 'monthly';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

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

  constructor() {}

  ngOnInit() {}
}

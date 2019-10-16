import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

import { Plan } from '../../plan.model';
import { PlanState } from '../../store/plan.state';
import * as PlanActions from '../../store/plan.action';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnChanges {
  // Attributes
  plans$: Observable<Plan[]>;
  @Input() type: Plan['type'];

  constructor(private store: Store) {}

  ngOnChanges() {
    this.store.dispatch(new PlanActions.GetPlans()); // fetch plan list
    this.plans$ = this.store.select(PlanState.plansOf(this.type));
  }
}

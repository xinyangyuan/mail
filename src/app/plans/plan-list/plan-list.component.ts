import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';

import { Plan } from '../plan.model';
import { PlanState } from '../store/plan.state';
import * as PlanActions from '../store/plan.action';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnInit {
  // Attributes
  @Select(PlanState.plans) plans$: Observable<Plan>;

  constructor(private store: Store) {}

  ngOnInit() {
    // fetch plan list
    this.store.dispatch(new PlanActions.GetPlans());
  }
}

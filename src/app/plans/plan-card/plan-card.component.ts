import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

import { Plan } from '../plan.model';
import * as PlanActions from '../store/plan.action';
import { PlanState } from '../store/plan.state';

@Component({
  selector: 'app-plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.css']
})
export class PlanCardComponent implements OnInit {
  // Attribute
  @Input() plan: Plan = { _id: '', name: 'simple', price: 999, mailCredit: -1, scanCredit: 1 };
  isSelected$: Observable<boolean>;

  // UI
  @Input() scale = 1;

  // Constructor:
  constructor(private store: Store) {}

  // Init Method:
  ngOnInit() {
    // this.plan property is undefined before initialization
    this.isSelected$ = this.store.select(PlanState.isSelected(this.plan));
  }

  // Method: plan card is clicked
  onClick() {
    this.store.dispatch(new PlanActions.SelectPlan(this.plan));
  }

  // Method: apply scale
  applyScale() {
    const styles = {
      '-ms-transform': `scale(${this.scale}, ${this.scale})`, // IE 9
      '-webkit-transform': `scale(${this.scale}, ${this.scale})`, // Safari
      transform: `scale(${this.scale}, ${this.scale})`
    };
    return styles;
  }
}

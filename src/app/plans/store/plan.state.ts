import { State, Selector, createSelector, StateContext, Action } from '@ngxs/store';

import { Plan } from '../plan.model';
import * as PlanActions from './plan.action';

const plans: Plan[] = [
  { _id: '1', name: 'Simple', price: 999, mailCredit: 20, scanCredit: 10 },
  { _id: '2', name: 'Pro', price: 1999, mailCredit: -1, scanCredit: 30 },
  { _id: '3', name: 'Master', price: 2999, mailCredit: -1, scanCredit: 100 }
];

/*
   Plan State
*/

export interface PlanStateModel {
  plan: Plan;
  plans: Plan[];
  selectedPlan: Plan;
}

/*
   Initial State
*/

const initialState: PlanStateModel = {
  plan: null,
  plans: [],
  selectedPlan: null
};

/*
   Action Map:
*/

@State<PlanStateModel>({ name: 'plan', defaults: initialState })
export class PlanState {
  // Constructor
  constructor() {}

  /*
   Selectors:
  */

  @Selector()
  static plans(state: PlanStateModel) {
    return state.plans;
  }

  @Selector()
  static plan(state: PlanStateModel) {
    return state.plan;
  }

  @Selector()
  static selectedPlan(state: PlanStateModel) {
    return state.selectedPlan;
  }

  // Selector dynamic
  static isSelected(plan: Plan) {
    return createSelector(
      [PlanState],
      (state: PlanStateModel) => {
        return state.selectedPlan ? state.selectedPlan._id === plan._id : false;
      }
    );
  }

  /*
   Action: get plans
  */

  @Action(PlanActions.GetPlans)
  getPlans(ctx: StateContext<PlanStateModel>) {
    // return new sate
    ctx.patchState({ plans }); // from constant defined on the top of document
  }

  /*
   Action: select a plan
  */

  @Action(PlanActions.SelectPlan)
  selectMail(ctx: StateContext<PlanStateModel>, action: PlanActions.SelectPlan) {
    // return new state
    ctx.patchState({ selectedPlan: action.payload });
  }
}
